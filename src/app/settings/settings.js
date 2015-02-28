angular.module( 'Wisen.settings', [
  'ui.router',
  'firebase'
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
.controller( 'SettingsCtrl', function ($scope, $firebase) {

  var ref = new Firebase("https://wisen.firebaseio.com/");

})

;

