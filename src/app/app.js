angular.module( 'Wisen', [
  'templates-app',
  'templates-common',
  'Wisen.welcome',
  'Wisen.register',
  'Wisen.settings',
  'Wisen.explore',
  'Wisen.connect',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/welcome' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Wisen' ;
    }
  });
})

;

