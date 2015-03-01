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
.controller( 'ConnectCtrl', function ($scope, $sinch, $login, $track, $rootScope) { 

  $rootScope.$digest();

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

  $rootScope.$on("Event", function () {
    console.log("Event!");
    $since.registerRecipient($rootScope.recipient);
    $scope.sinchUsername.receiver = $rootScope.recipientUID.slice(8);
    $scope.sinchUsername.sender = $login.getSinchUsername();
    $scope.name.receiver = $rootScope.recipientName;
    $scope.name.sender = $login.getName();
    $sinch.getImageURL(function (img) {
      $scope.imageURL.receiver = img;
      $login.getImageURL(function (image) {
        $scope.imageURL.sender = img;
        $since.startClient(function () {
          global_username = $login.getSinchUsername();
          $scope.$digest();
        }, function (error) {
          console.log(error);
        });
      });
    });  
  });

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

})

;
