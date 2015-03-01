angular.module( 'Wisen.explore', [
  'ui.router',
  'firebase',
  'angularGeoFire',
  'Wisen.firebaseTwitterLogin',
  'uiGmapgoogle-maps'
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
.controller('ExploreCtrl', function ($scope, $geofire, $login, uiGmapGoogleMapApi) {

  var $geo = $geofire($login.getRef().child("userLocations"));
  $scope.circles = {};

  $scope.search = function () {
    var tagName = $scope.searchTag;
    // TODO
  };

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
    console.log("pushNewLocation");
  });

  // $scope.$on("sortNewLocation", function () {
  //   $scope.locations.sort(function compareTo(loc1, loc2) {
  //     return loc1.distance - loc2.distance;
  //   });
  //   console.log("Nearest Location Find!");
  //   console.log($scope.locations[0]);
  // });

  uiGmapGoogleMapApi.then(function (maps) {

    $geo.$get($login.getUid())
        .then(function (location) {
          console.log(location);
          $scope.map.center.latitude = location[0];
          $scope.map.center.longitude = location[1];
          $scope.$emit("locationRetrieved");
          $scope.$digest();
          console.log("locationRetrieved");
        });

    $scope.$on("pushNewLocation", function (event, key, location, distance) {
      var c = new maps.Circle({
        center: {
          lat: location[0],
          lng: location[1],
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
        clickable: true
      });
      c.key = key;
      c.distance = distance;
      c.loc = {
        latitude: location[0],
        longitude: location[1]
      };
      $scope.circles[key] = c;
      //$scope.$emit("sortNewLocation");

      maps.event.addListener(c, 'click', function (c, e, m, a) {
        console.log("clicked on " + c.key);
      });

      console.log("circle created");
      console.log(c);
      console.log(c.center);
      console.log(c.key);

      $scope.$digest();
    });
  });

})

;

