angular.module( 'Wisen.explore', [
  'ui.router',
  'firebase',
  'angularGeoFire',
  'Wisen.firebaseTwitterLogin',
  'uiGmapgoogle-maps',
  'Wisen.brain'
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
.controller('ExploreCtrl', function ($scope, $geofire, $login, $brain) {

  var RANGE_CONSTANT = 10;

  var $geo = $geofire($login.getRef().child("userLocations"));
  $scope.circles = {};
  $scope.range = {
    center: {
      longitude: -122.4,
      latitude: 37.77
    },
    radius: RANGE_CONSTANT*1000,
    fill: {
      color: "$B2089B",
      opacity: 0.2
    },
    stroke: {
      color: "$B2089B",
      weight: 2,
      opacity: 1
    },
    clickable: false
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
    $scope.mentor = config;
    $scope.searchResult.result = "Based on your geolocation, we carefully chose this mentor for you.";
    console.log(config);
    $scope.sendRequestToMentor(config);
  });

  $scope.$on("mentorNotFound", function (event) {
    alert("FUCKED! MNFError!");
    $scope.searchResult.result = "Sorry! Based on your geolocation, we could not find a mentor for you.";
 
  });

  $scope.sendRequestToMentor = function (config) {
    console.log("sending request to " + config.uid);
    $login.getRef().child("requests").push({
      latitude: $scope.range.center.latitude,
      longitude: $scope.range.center.latitude,
      menteeUID: $login.getUid(),
      mentorUID: config.uid,
      radius: RANGE_CONSTANT,
      status: 0,
      tag: config.tag
    });
  };

  $geo.$get($login.getUid())
    .then(function (location) {
      if (location) {
        $scope.map.center.latitude = location[0];
        $scope.map.center.longitude = location[1];
        $scope.range.center.latitude = location[0];
        $scope.range.center.longitude = location[1];
        $scope.$emit("locationRetrieved");
      } else {
        console.log("FUCKED! NullLocationError!");
      }
    });

  $scope.map = {
    center: {
      longitude: -122.4,
      latitude: 37.77
    },
    zoom: 12
  };

  $scope.$on("locationRetrieved", function () {
    $geo.$query({
      center: [$scope.map.center.latitude, $scope.map.center.longitude],
      radius: 20
    }).on("key_entered", "pushNewLocation");
  });

  $scope.$on("pushNewLocation", function (event, key, location, distance) {
    $scope.circles[key] = {
      key: key,
      distance: distance,
      center: {
        latitude: location[0],
        longitude: location[1]
      },
      radius: 100,
      stroke: {
        color: '$08B21F',
        weight: 2,
        opacity: 1
      },
      fill: {
        color: '#08B21F',
        opacity: 0.5
      },
      clickable: true,
      draggable: true,
      geodesic: true
    };
  });

})

;
