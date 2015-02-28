angular.module( 'Wisen.settings', [
  'ui.router',
  'firebaseTwitterLogin'
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
.controller( 'SettingsCtrl', function ($scope, $login) {
  
  var userObj = $login.getRef().child("users").child(getUid());

  $scope.name = $login.getName();

  userObj.on("value", function (user) {
    $scope.user = user;
  });

  $scope.newTags = {"": true};

  $scope.toRemove = {};

  $scope.remove = function (key) {
    $scope.toRemove[key] = true;
    delete $scope.user[key];
  };

  $scope.addField = function () {
    $scope.newTags[""] = true;
  };

  $scope.save = function () {
    for (tag in $scope.toRemove) {
      userObj.child(tag).remove();
    }
    for (tag in $scope.newTags) {
      if (tag !== "") {
        var obj = {};
        obj[tag] = true;
        userObj.child("tags").set(obj);
      }
    }
  };

})

;

