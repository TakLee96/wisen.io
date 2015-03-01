angular.module("Wisen.nav", [
  "Wisen.firebaseTwitterLogin",
  "ui.router"
])

.controller("navCtrl", function ($scope, $login, $rootScope) {

  $rootScope.name = $login.getName();

  $scope.logout = function () {
    $login.clear();
    document.location.reload(true);
  };

})

.directive("wisenNav", function () {

  return {
    restrict: 'EA',
    controller: 'navCtrl',
    templateUrl: 'wisenNav/wisenNav.tpl.html'
  };

})

;