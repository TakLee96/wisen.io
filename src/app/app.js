angular.module( 'Wisen', [
  'templates-app',
  'templates-common',
  'Wisen.welcome',
  'Wisen.settings',
  'Wisen.explore',
  'Wisen.connect',
  'ui.router',
  'Wisen.firebaseTwitterLogin',
  'Wisen.nav'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/welcome' );
})

.controller( 'AppCtrl', function ($scope, $location, $login, $state) {

  $scope.$on('$stateChangeSuccess', function(event, toState){
      $scope.pageTitle = toState.data.pageTitle + ' | Wisen';
      if ($login.getUid() === null) {
        $state.go("welcome");
      }
  });

})

;

