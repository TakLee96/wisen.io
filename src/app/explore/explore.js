angular.module( 'Wisen.explore', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'explore', {
    url: '/explore',
    controller: 'ExploreCtrl',
    templateUrl: 'explore/explore.tpl.html',
    data:{ pageTitle: 'Explore' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller('ExploreCtrl', function ($scope) {
})

;

