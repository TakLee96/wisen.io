angular.module("Wisen.nav", [
  "Wisen.firebaseTwitterLogin",
  "ui.router"
])

.controller("navCtrl", function ($scope, $login) {

  $scope.name = $login.getName();

  $scope.logout = function () {
    $login.clear();
    document.location.reload(true);
  };

})

.directive("wisenNav", function () {

  return {
    restrict: 'EA',
    controller: 'navCtrl',
    templateUrl: 'nav/nav.tpl.html'
  };

})

;