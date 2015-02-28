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
.controller( 'ConnectCtrl', function ($scope, $sinch, $login) {

  $scope.messages = [];
  $scope.prevView = {
    senderId: $login.getSinchUsername(),
    recipientId: "",
    textBody: ""
  };

  console.log($scope.messages);

  $sinch.startClient(function () {
    global_username = $login.getSinchUsername();
  }, function (error) {
    console.log(error);
  });

  $scope.send = function () {
    $sinch.sendMessage($scope.prevView.recipientId, $scope.prevView.textBody, function (error) {
      console.log(error);
    });
  };

  $sinch.onMessageDelivered(function (deliveryInfo) {
    console.log("onMessageDelivered triggered");
    console.log(deliveryInfo);
  });

  $sinch.onIncomingMessage(function (receivedInfo) {    
    var message = {
      senderId: receivedInfo.senderId,
      recipientId: receivedInfo.recipientIds[1],
      textBody: receivedInfo.textBody,
      timestamp: receivedInfo.timestamp
    };
    console.log(receivedInfo);
    $scope.messages.push(message);
    if (receivedInfo.direction) {
      $scope.prevView.textBody = "";
    }
    $scope.$digest();
  });

})

;

