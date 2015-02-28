angular.module( 'Wisen.register', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'register', {
    url: '/register',
    controller: 'RegisterCtrl',
    templateUrl: 'register/register.tpl.html',
    data:{ pageTitle: 'Register' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'RegisterCtrl', function ($scope) {
})

;

