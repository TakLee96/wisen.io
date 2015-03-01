angular.module( 'Wisen.connect', [
  'ui.router',
  'Wisen.sinchClient',
  'Wisen.firebaseTwitterLogin',
  'ui.bootstrap'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.run(function($anchorScroll) {
  $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
})

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
  $scope.text = "";
  $scope.ready = false;

  $scope.imageURL = {
    sender: "null",
    receiver: "null"
  };

  $scope.name = {
    sender: "null",
    receiver: "null"
  };

  $scope.sinchUsername = {
    sender: "null",
    receiver: "null"
  };

  var resolve = function () {
    console.log("resolving");
    $sinch.getImageURL(function (url) {
      $scope.imageURL.receiver = url;
      $login.getImageURL(function (img) {
        $scope.imageURL.sender = img;
        $scope.$broadcast("senderReceiverResolved");
        $scope.$digest();
      });
    });
  };

  $scope.$on("recipientRegistered", function (event, recipient) {
    console.log("recipientRegistered event caught");
    $scope.sinchUsername.receiver = $sinch.getSinchUsername();
    $scope.sinchUsername.sender = $login.getSinchUsername();
    $scope.name.receiver = $sinch.getName();
    $scope.name.sender = $login.getName();
    resolve();
  });

  $scope.$on("senderReceiverResolved", function () {
    console.log("senderReceiverResolved event caught");
    $sinch.startClient(function () {
      global_username = $login.getSinchUsername();
      $scope.ready = true;
      $scope.$digest();
    }, function (error) {
      console.log(error);
    });
  });

  $scope.send = function () {
    console.log("send!" + $scope.text);
    $sinch.sendMessage($scope.text, function (error) {
      console.log(error);
    });
  };

  $sinch.onMessageDelivered(function (deliveryInfo) {
    console.log("onMessageDelivered triggered");
    console.log(deliveryInfo);
  });

  $sinch.onIncomingMessage(function (receivedInfo) {
    console.log("Receive!!!");
    var message = {
      senderId: receivedInfo.senderId,
      recipientId: receivedInfo.recipientIds[1],
      textBody: receivedInfo.textBody,
      timestamp: receivedInfo.timestamp,
      imageURL: (receivedInfo.direction) ? $scope.imageURL.sender : $scope.imageURL.receiver
    };
    console.log(receivedInfo);
    $scope.messages.push(message);
    if (receivedInfo.direction) {
      $scope.text = "";
    }
    $scope.$digest();
  });

})

;

