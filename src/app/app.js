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

.controller( 'AppCtrl', function ($scope, $location, $login, $state, $sinch) {

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $scope.pageTitle = toState.data.pageTitle + ' | Wisen';
      if ($login.getUid() === null) {
        $state.go("welcome");
      } else if (toState.name === "connect") {
        $sinch.registerRecipient(toParams);
      }
  });

})

;

