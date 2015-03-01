angular.module( 'Wisen.settings', [
  'ui.router',
  'Wisen.firebaseTwitterLogin',
  'ui.bootstrap',
  'angularGeoFire'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'settings', {
    url: '/settings',
    controller: 'SettingsCtrl',
    templateUrl: 'settings/settings.tpl.html',
    data:{ pageTitle: 'Settings' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'SettingsCtrl', function ($scope, $login, $state, $geofire) {

  if ($login.getUid() === null) {
    $state.go("welcome");
  }
  
  var userObj = $login.getRef().child("users").child($login.getUid());
  var $geo = $geofire($login.getRef().child("userLocations"));

  $scope.locationAlert = {
    type: "warning",
    msg: "retrieving location..."
  };

  var id = setTimeout(function () {
    $scope.locationAlert.type = "danger";
    $scope.locationAlert.msg = "retrieving is slow...";
  }, 5000);

  $scope.name = $login.getName();

  userObj.on("value", function (user) {
    $scope.user = user.val();
    $scope.$digest();
  });

  $scope.newTags = [""];
  $scope.toRemove = {};

  $scope.remove = function (key) {
    $scope.toRemove[key] = true;
    delete $scope.user.tags[key];
  };

  $scope.addField = function () {
    $scope.newTags.push("");
  };

  $scope.save = function () {
    for (var rtag in $scope.toRemove) {
      userObj.child("tags").child(rtag).remove();
    }
    var tag;
    for (var i = 0; i < $scope.newTags.length; i++) {
      tag = $scope.newTags[i];
      if (tag !== "") {
        var obj = {};
        obj[tag.toLowerCase()] = true;
        userObj.child("tags").update(obj);
      }
    }
    $scope.newTags = [""];
    $scope.toRemove = {};
  };

})

;

