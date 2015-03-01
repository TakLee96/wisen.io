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
      weight: 3,
      opacity: 1
    },
    clickable: false
  };

  $scope.search = function () {
    var tagName = $scope.searchTag;
    var done = false;
    $brain.figureOutBestMentorByTag(tagName, $scope.circles, function (location) {
      if (done) {
        return;
      } else if (location) {
        done = true;
        $scope.$emit("mentorFound", location);
      } else {
        done = true;
        $scope.$emit("mentorNotFound");
      }
    })
  };

  $scope.$on("mentorFound", function (event, args) {
    alert("YAY!!!");
    console.log(args.key);
    $scope.sendRequestToMentor(args.key);
  });

  $scope.$on("mentorNotFound", function (event) {
    alert("FUCKED! MNFError!");
  });

  $scope.handleClick = function (key) {
    $scope.sendRequestToMentor(key);
  };

  $scope.sendRequestToMentor = function (key) {
    console.log("sending request to " + key);
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
      events: {
        click: function (circle, event, model, args) {
          console.log(circle);
          console.log("selected");
        }
      }
    };
  });

})

;

