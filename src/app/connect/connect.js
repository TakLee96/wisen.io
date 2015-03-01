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
.controller( 'ConnectCtrl', function ($scope, $sinch, $login, $track) { 

  $scope.messages = [];
  $scope.content = "";
  $scope.ready = false;

  $scope.imageURL = {
    sender: "",
    receiver: ""
  };

  $scope.name = {
    sender: "",
    receiver: ""
  };

  $scope.sinchUsername = {
    sender: "",
    receiver: ""
  };

  var launch = function () {
    console.log("Launch!");
    $scope.sinchUsername.receiver = $sinch.getSinchUsername();
    $scope.sinchUsername.sender = $login.getSinchUsername();
    $scope.name.receiver = $sinch.getName();
    $scope.name.sender = $login.getName();
    $sinch.getImageURL(function (img) {
      console.log("Image1 Processed");
      $scope.imageURL.receiver = img;
      $login.getImageURL(function (image) {
        console.log("Image2 Processed");
        $scope.imageURL.sender = image;
        $sinch.startClient(function () {
          console.log("Client Started!");
          global_username = $login.getSinchUsername();
          $scope.$digest();
        }, function (error) {
          console.log(error);
        });
      });
    });  
  };

  $scope.send = function () {
    console.log("send!" + $scope.content);
    $sinch.sendMessage($scope.content, function (error) {
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
      $scope.content = "";
    }
    $scope.$digest();
  });

  launch();

})

;
