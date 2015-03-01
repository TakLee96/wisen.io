angular.module( 'Wisen.explore', [
  'ui.router',
  'firebase',
  'angularGeoFire',
  'Wisen.firebaseTwitterLogin',
  'uiGmapgoogle-maps',
  'Wisen.brain',
  'Wisen.userInfoTracking'
])


/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'explore', {
    url: '/explore',
    controller: 'ExploreCtrl',
    templateUrl: 'explore/explore.tpl.html',
    data:{ pageTitle: 'Explore' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller('ExploreCtrl', function ($scope, $geofire, $login, $brain, $track) {

  var RANGE_CONSTANT = $track.getRangeConstant();

  var $geo = $geofire($login.getRef().child("userLocations"));
  
  $scope.circles = {};
  $scope.myCircle = {
    center: {
      latitude: 37.77,
      longitude: -122.4
    }
  };
  //should be init when user location is ready
  $scope.range = {
    center: {
      longitude: -122.4,
      latitude: 37.77
    },
    radius: RANGE_CONSTANT*1000,
    fill: {
      color: "#08B21F",
      opacity: 0.5
    },
    stroke: {
      color: "#000000",
      weight: 3,
      opacity: 1
    },
    draggable: true
  };

  $scope.search = function () {
    var tagName = $scope.searchTag;
    if (tagName.trim() !== "") {
      $brain.figureOutBestMentorByTag(tagName, $scope.circles, function (uid) {
        if (uid) {
          $scope.$emit("mentorFound", {uid: uid, tag: tagName});
        } else {
          $scope.$emit("mentorNotFound");
         }
      });
    } else {
      alert("Please provide a tag!");
    }
  };

  $scope.$on("mentorFound", function (event, config) {
    alert("YAY!!!");
    console.log(config);
    $scope.sendRequestToMentor(config);
  });

  $scope.$on("mentorNotFound", function (event) {
    alert("FUCKED! MNFError!"); 
  });

  $scope.sendRequestToMentor = function (config) {
    console.log("sending request to " + config.uid);
    $track.becomeActive();
    console.log($login.getRef().child("requests").push({
      latitude: $scope.range.center.latitude,
      longitude: $scope.range.center.longitude,
      menteeUID: $login.getUid(),
      mentorUID: config.uid,
      radius: RANGE_CONSTANT,
      status: 0,
      tag: config.tag.toLowerCase()
    }).key());
  };

  $scope.map = {
    center: {
      longitude: -122.4,
      latitude: 37.77
    },
    zoom: 12
  };

  $scope.$on("myLocationChange", function (event, location) {
    console.log("myLocationChange event caught");

    if ($scope.myCircle.radius) {
      $scope.myCircle.center.latitude = location.latitude;
      $scope.myCircle.center.longitude = location.longitude;
    } else {
      console.log("Contructing my circle for the first time");
      $scope.myCircle = {
        center: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        radius: 100,
        stroke: {
          color: '#000000',
          weight: 1,
          opacity: 1
        },
        fill: {
          color: "#443EF3",
          opacity: 0.5
        },
        geodesic: true
      };
      $scope.map.center.longitude = location.longitude;
      $scope.map.center.latitude = location.latitude;
      $scope.range.center.longitude = location.longitude;
      $scope.range.center.latitude = location.latitude;
      //could change focus of map
    }
    $scope.$digest();
  });

  $scope.$on("multipleLocationChange", function (event, key, location, distance) {
    console.log("multipleLocationChange event caught");

    if (key !== $login.getUid()) {
      if (!$scope.circles[key]) {
        $scope.circles[key] = {
          key: key,
          distance: distance,
          center: {
            latitude: location[0],
            longitude: location[1]
          },
          radius: 100,
          stroke: {
            color: '#000000',
            weight: 1,
            opacity: 1
          },
          geodesic: true
        };
      } else {
        $scope.circles[key].latitude = location[0];
        $scope.circles[key].longitude = location[1];
      }
      $scope.$digest();
    }
  });

})

;
