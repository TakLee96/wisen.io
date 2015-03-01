angular.module("Wisen.userInfoTracking", [
  'Wisen.firebaseTwitterLogin',
  'angularGeoFire'
])

.factory("$track", function ($login, $rootScope, $interval, $state, $geofire) {

  var TRACT_PERIOD_CONSTANT = 10 * 1000;
  var RANGE_CONSTANT = 10;
  var $myGeo = null;
  var $geo = $geofire($login.getRef().child("userLocations"));

  var getGeolocation = function (cb) {
    console.log("getting geoLocation");
    if (navigator.geolocation) {
      console.log("geoLocation available for browser");
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("(lat: %s, lng: %s)", position.coords.latitude, position.coords.longitude);
        cb({latitude: position.coords.latitude, longitude: position.coords.longitude});
        $myGeo.$set("location", [ position.coords.latitude, position.coords.longitude ]);
      });
      //upload
    } else {
      //download
      console.log("geoLocation NOT available for browser, downloading from firebase");
      $myGeo.$get("location").then(function (location) {
        console.log("(lat: %s, lng: %s)", location[0], location[1]);
        cb({latitude: location[0], longitude: location[1]}); //could error
      });
    }
  };

  var queryLocation = function (lat, lng) {
    console.log("querying on (lat: %s, lng: %s)", lat, lng);
    $geo.$query({
      center: [lat, lng],
      radius: RANGE_CONSTANT
    }).on("key_entered", "multipleLocationChange");
    console.log("Will emit multipleLocationChange");
  };

  var serviceInstance = {
    latitude: 0,
    longitude: 0,
    active: false,
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
    init: function () {
      console.log("init called!");

      $myGeo = $geofire($login.getRef().child("users").child($login.getUid()));

      var func = function () {
        getGeolocation(function (location) {
          console.log("Back to init (lat: %s, lng: %s)", location.latitude, location.longitude);
          this.latitude = location.latitude;
          this.longitude = location.longitude;
          $rootScope.$broadcast("myLocationChange", location);
          console.log("Will emit myLocationChange");
          queryLocation(this.latitude, this.longitude);
        }.bind(this));
      }.bind(this);

      func();
      $interval(func, TRACT_PERIOD_CONSTANT);

      $login.getRef().child("requests").orderByKey().on("child_added", this.update);
      $login.getRef().child("requests").orderByKey().on("child_changed", this.update);
    },
    update: function (data) {
      var request = data.val();
      var requestID = data.key();
      if (request === null) {
        console.log("Unexpected Error");
      }
      var service = this;
      switch (request.status) {
        case 0:
          if (request.mentorUID === $login.getUid()) {
            if (service.isActive()) {
              //reply that I am not available
            } else {
              //proceed NOT DONE
              console.log("request with status 0 received");
              $login.getRef().child("users").child(request.menteeUID).child("displayName").once("value", function (name) {
                var r = confirm("Wisen user "+name.val()+" wants you to teach him about #"+request.tag);
                if (r) {
                  //agree
                  service.becomeActive(data); //not active to active
                  $login.getRef().child("requests").child(requestID).update({status: 1});
                  alert("You accepted his/her request");
                  $state.go("connect", {recipientUId: request.menteeUID, recipientName: name});
                } else {
                  //reject
                  service.becomeInactive();
                  $login.getRef().child("requests").child(requestID).update({status: 3});
                }
              });
            }
          } //otherwise non of my business
          break;
        case 1:
          if (request.menteeUID === $login.getUid()) {
            if (service.isActive()) {
              //process NOT DONE
              console.log("request with status 1 replied");
              $login.getRef().child("requests").child(requestID).update({status: 2});
              $login.getRef().child("users").child(request.mentorUID).child("displayName").once("value", function (name) {
                alert("Wisen user "+name.val()+" accepts your request to learn #" + request.tag);
                $state.go("connect", {recipientUId: request.mentorUID, recipientName: name});
              }); 
            } else {
              //I'm down, reply that I have quited
              service.becomeInactive();
              $login.getRef().child("requests").child(requestID).update({status: 3});
            }
          } //otherwise non of my business
          break;
        case 3:
          console.log(service);
          if (service.isActive() && requestID === service.data.key()) {
            service.becomeInactive();
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