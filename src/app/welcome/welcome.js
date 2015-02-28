angular.module( 'Wisen.welcome', [
  'ui.router',
  'Wisen.firebaseTwitterLogin'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'welcome', {
    url: '/welcome',
    controller: 'WelcomeCtrl',
    templateUrl: 'welcome/welcome.tpl.html',
    data:{ pageTitle: 'Welcome' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'WelcomeCtrl', function ($scope, $login, $state) {

  if ($login.getUid()) {
    $state.go("settings");
  }

  $scope.twitterLogin = $login.login(function (error, uid) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Login Successful:", uid);
      $state.go("settings");
    }
  });

})

;
