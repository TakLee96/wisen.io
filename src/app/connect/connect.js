angular.module( 'Wisen.connect', [
  'ui.router',
  'Wisen.sinchClient',
  'Wisen.firebaseTwitterLogin'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'connect', {
    url: '/connect',
    controller: 'ConnectCtrl',
    templateUrl: 'connect/connect.tpl.html',
    data:{ pageTitle: 'Connect' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'ConnectCtrl', function ($scope, $sinch, $login) {

  $scope.messages = [];

  $sinch.startClient(function () {
    global_username = $login.getUid().slice(8);
  }, function (error) {
    console.log(error);
  });

  $scope.send = function () {
    $sinch.sendMessage($scope.recipient, $scope.text, function (error) {
      console.log(error);
    });
  };

  $sinch.onMessageDelivered = function (deliveryInfo) {
    var message = {
      senderId: deliveryInfo.senderId,
      recipientId: deliveryInfo.recipientId,
      content: $scope.text
    };
    messages.push(message);
    $scope.text = "";
  };

})

;

