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

.controller( 'AppCtrl', function ($scope, $location, $login, $state, $sinch, $track, $rootScope) {

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $scope.pageTitle = toState.data.pageTitle + ' | Wisen';
      if ($login.getUid() === null) {
          if (fromState.name === "welcome" && toState.name !== "welcome"){
              alert("This page is unavailable to you right now. Please log in using Twitter first!");
          }
          $state.go("welcome");
      }
      if (toState.name === "connect") {
        console.log("going to state connect");
        console.log("$rootScope current has:");
        console.log($rootScope.recipient);
        console.log("-----------------------");
        $sinch.registerRecipient($rootScope.recipient);
      }
      if ($track.hasNotInit() && $track.hasNotLogIn()) {
        $track.init();
      }
  });

})

;
