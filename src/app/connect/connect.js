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
.config(["$stateProvider", function config( $stateProvider ) {
  $stateProvider.state( 'connect', {
    url: '/connect',
    controller: 'ConnectCtrl',
    templateUrl: 'connect/connect.tpl.html',
    data:{ pageTitle: 'Connect' }
  });
}])

/**
 * And of course we define a controller for our route.
 */
.controller( 'ConnectCtrl', ["$scope", "$sinch", "$login", function ($scope, $sinch, $login) {

  $scope.messages = [];

  $sinch.startClient(function () {
    global_username = $login.getSinchUsername();
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

  $sinch.onIncomingMessage = function (message) {
    var message = {
      senderId: message.senderId,
      recipientId: $login.getSinchUsername(),
      content: message.textBody
    };
    messages.push(message);
  }

})

;

