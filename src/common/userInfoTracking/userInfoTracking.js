angular.module("Wisen.userInfoTracking", [
  'Wisen.firebaseTwitterLogin',
  'angularGeoFire'
])

.factory("$track", function ($login, $interval, $state, $geofire) {

  var TRACT_PERIOD_CONSTANT = 20 * 1000;
  var RANGE_CONSTANT = 10;
  var $myGeo = null;
  var $geo = $geofire($login.getRef().child("userLocations"));

  var getGeolocation = function (cb) {
    console.log("getting geoLocation");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("(lat: %s, lng: %s)", position.coords.latitude, position.coords.longitude);
        cb({latitude: position.coords.latitude, longitude: position.coords.longitude});
        $myGeo.$set("location", [ position.coords.latitude, position.coords.longitude ]);
      });
      //upload
    } else {
      //download
      $myGeo.$get("location").then(function (location) {
        console.log("(lat: %s, lng: %s)", location[0], location[1]);
        cb({latitude: location[0], longitude: location[1]}); //could error
      });
    }
  };

  var queryLocation = function (lat, lng) {
    $geo.$query({
      center: [lat, lng],
      radius: RANGE_CONSTANT
    }).on("key_entered", "multipleLocationChange");
    console.log("Will emit multipleLocationChange");
  };

  var serviceInstance = {
    initted: false,
    latitude: 0,
    longitude: 0,
    active: false,
    recipient: null,
    hasNotInit: function () {
      return !this.initted;
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
    getRangeConstant: function () {
      return RANGE_CONSTANT;
    },
    getRecipient: function () {
      return this.recipient;
    },
    init: function () {
      console.log("CHECK THIS OUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(this);
      this.initted = true;

      $myGeo = $geofire($login.getRef().child("users").child($login.getUid()));

      var func = function () {
        getGeolocation(function (location) {
          this.latitude = location.latitude;
          this.longitude = location.longitude;
          $rootScope.$broadcast("myLocationChange", location);
          console.log("Will emit myLocationChange");
          queryLocation(this.latitude, this.longitude);
        }.bind(this));
      }.bind(this);

      func();
      $interval(func, TRACT_PERIOD_CONSTANT);

      $login.getRef().child("requests").orderByKey().on("child_added", superUpdate.bind(this));
      $login.getRef().child("requests").orderByKey().on("child_changed", superUpdate.bind(this));
    },
    update: null
  };

  function superUpdate (data) {
      console.log("update function called");
      console.log("logging this out:");
      console.log(this);

      var request = data.val();
      var requestID = data.key();
      if (request === null) {
        console.log("Unexpected Error");
      }
      var service = this;
      switch (request.status) {
        case 0: //mentor manipulation
          if (request.mentorUID === $login.getUid()) {
            if (service.isActive()) {
              //reply that I am not available
            } else {
              //proceed NOT DONE
              console.log("request with status 0 received");
              $login.getRef().child("users").child(request.menteeUID).child("displayName").once("value", function (name) {
                var r = confirm("Wisen user "+name.val()+" wants you to teach him/her about #"+request.tag);
                console.log(r);
                if (r) {
                  //agree
                  console.log("In agree route");
                  service.becomeActive(data); //not active to active
                  $login.getRef().child("requests").child(requestID).update({status: 1});
                  alert("You accepted his/her request");
                  console.log(service.recipient);
                  service.recipient = {recipientUID: request.menteeUID, recipientName: name.val()};
                  console.log("recipient attribute in service");
                  $state.go("connect");
                  console.log(service.recipient);
                } else {
                  //reject
                  console.log("In disagree route");
                  service.becomeInactive();
                  $login.getRef().child("requests").child(requestID).update({status: 3});
                }
              });
            }
          } //otherwise non of my business
          break;
        case 1: //mentee manipulation
          console.log("detected update");
          if (request.menteeUID === $login.getUid()) {
            console.log("menteeUID match");
            if (service.isActive()) {
              //process NOT DONE
              console.log("mentee is active");
              console.log("request with status 1 replied");
              $login.getRef().child("requests").child(requestID).update({status: 2});
              $login.getRef().child("users").child(request.mentorUID).child("displayName").once("value", function (name) {
                alert("Wisen user "+name.val()+" accepts your request to learn #" + request.tag);
                service.recipient = {recipientUID: request.menteeUID, recipientName: name.val()};
                console.log(service.recipient);
                console.log("recipient attribute in service");
                $state.go("connect");
                console.log(service.recipient);
              }); 
            } else {
              //I'm down, reply that I have quited
              console.log("mentee is active");
              service.becomeInactive();
              $login.getRef().child("requests").child(requestID).update({status: 3});
            }
          } //otherwise non of my business
          break;
        case 3:
          console.log(service);
          if (service.isActive() && requestID === data.key()) {
            service.becomeInactive();
          }
          break;
        default:
          console.log("SOME request with status: " + request.status);
          break;
      }
    }

  return serviceInstance;
})

;