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
  'Wisen.sinchClient'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/welcome' );
})

.controller( 'AppCtrl', function ($scope, $location, $login, $state, $sinch) {

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams){
      $scope.pageTitle = toState.data.pageTitle + ' | Wisen';
      if ($login.getUid() === null) {
        $state.go("welcome");
      } else if (toState.name === "connect") {
        $sinch.registerRecipient(toParams);
      }
  });

})

;

