angular.module( 'Wisen', [
  'templates-app',
  'templates-common',
  'Wisen.welcome',
  'Wisen.settings',
  'Wisen.explore',
  'Wisen.connect',
  'ui.router',
  'Wisen.firebaseTwitterLogin',
  'Wisen.nav',
  'Wisen.sinchClient',
  'Wisen.userInfoTracking'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/welcome' );
})

.controller( 'AppCtrl', function ($scope, $location, $login, $state, $sinch, $track) {

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      console.log("$stateChangeSuccess Fired");
      $scope.pageTitle = toState.data.pageTitle + ' | Wisen';
      if ($login.getUid() === null) {
          if (fromState.name === "welcome" && toState.name !== "welcome"){
              alert("This page is unavailable to you right now. Please log in using Twitter first!");
          }
          $state.go("welcome");
      }
      if ($track.hasNotInit()) {
        $track.init();
      }
      if (toState.name === "connect") {
        console.log("going to state connect...");
        var recipient = $track.getRecipient();
        console.log("recipient is now in app.js");
        console.log(recipient);
        $sinch.registerRecipient(recipient);
      }
  });

  $scope.$on('$stateChangeStart', function (event, toState) {
    console.log("$stateChangeStart Fired");
      if (toState.name === "connect") {
        console.log("going to state connect...");
        var recipient = $track.getRecipient();
        console.log("recipient is now in app.js");
        console.log(recipient);
        $sinch.registerRecipient(recipient);
      }
  });

})

;
