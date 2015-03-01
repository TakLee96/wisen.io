angular.module("Wisen.userInfoTracking", [
  'Wisen.firebaseTwitterLogin'
])

.factory("$track", function ($login, $rootScope, $interval, $state) {

  var TRACT_PERIOD_CONSTANT = 20 * 1000;

  var getGeolocation = function (cb) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(cb);
    } else {
      alert("No Location Service!!!");
    }
  };

  var serviceInstance = {
    latitude: 0,
    longitude: 0,
    active: false,
    init: function () {
      $interval(function () {
        getGeolocation(function (position) {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        }.bind(this));
      }.bind(this), TRACT_PERIOD_CONSTANT);

      $login.getRef().child("requests").orderByKey().on("child_added", this.update);
      $login.getRef().child("requests").orderByKey().on("child_changed", this.update);
    },
    getLat: function () {
      return this.latitude;
    },
    getLng: function () {
      return this.longitude;
    },
    isActive: function () {
      return this.active;
    },
    becomeActive: function (data) {
      this.active = true;
      this.data = data;
    },
    becomeInactive: function () {
      this.active = false;
      this.data = null;
    },
    update: function (data) {
      var request = data.val();
      var requestID = data.key();
      if (request === null) {
        console.log("Unexpected Error");
      }
      switch (request.status) {
        case 0:
          if (request.mentorUID === $login.getUid()) {
            if (this.isActive()) {
              //reply that I am not available
            } else {
              //proceed NOT DONE
              console.log("request with status 0 received");
              $login.getRef().child("users").child(request.menteeUID).child("displayName").once("value", function (name) {
                var r = confirm("Wisen user "+name.val()+" wants you to teach him about #"+request.tag);
                if (r) {
                  //agree
                  this.becomeActive(data); //not active to active
                  $login.getRef().child("requests").child(requestID).update({status: 1});
                  alert("You accepted his/her request");
                  $state.go("connect", {recipientUId: request.menteeUID, recipientName: name});
                } else {
                  //reject
                  this.becomeInactive();
                  $login.getRef().child("requests").child(requestID).update({status: 3});
                }
              });
            }
          } //otherwise non of my business
          break;
        case 1:
          if (request.menteeUID === $login.getUid()) {
            if (this.isActive()) {
              //process NOT DONE
              console.log("request with status 1 replied");
              $login.getRef().child("requests").child(requestID).update({status: 2});
              $login.getRef().child("users").child(request.mentorUID).child("displayName").once("value", function (name) {
                alert("Wisen user "+name.val()+" accepts your request to learn #" + request.tag);
                $state.go("connect", {recipientUId: request.mentorUID, recipientName: name});
              }); 
            } else {
              //I'm down, reply that I have quited
              this.becomeInactive();
              $login.getRef().child("requests").child(requestID).update({status: 3});
            }
          } //otherwise non of my business
          break;
        case 3:
          if (this.isActive() && requestID === this.data.key()) {
            this.becomeInactive();
          }
          break;
        default:
          console.log("SOME request with status: " + request.status);
          break;
      }
    },
    data: null
  };

  return serviceInstance;
})

;