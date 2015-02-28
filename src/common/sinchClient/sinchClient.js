angular.module("Wisen.sinchClient", [
  'Wisen.firebaseTwitterLogin'
])

.factory("$constant", function () {
  return {
    getApplicationKey: function () {
      return 'c01240e3-aa90-482f-b9f7-e1d10e731888';
    },
    getCommonPassword: function () {
      return 'IamAGreatHacker12345';
    }
  };
})
//b063ab0f-bfbc-4a6a-b191-401d579cb8cf
.factory("$sinch", function ($login, $constant) {

  var sinchClient = new SinchClient({
    applicationKey: $constant.getApplicationKey(),
    capabilities: {messaging: true},
    startActiveConnection: true,
    onLogMessage: function (message) {
      console.log("OnLogMessage triggered");
      console.log(message);
    }
  });

  var serviceInstance = {
    sinchClient: sinchClient,
    messageClient: sinchClient.getMessageClient(),
    getClient: function () {
      return this.sinchClient;
    },
    startClient: function (cb, errorHandler) { 
      var user = {
        username: $login.getSinchUsername(),
        password: $constant.getCommonPassword()
      };
      sinchClient.newUser(user, function (ticket) {
        sinchClient.start(ticket).then(cb).fail(errorHandler);
      }, function (error) {
        sinchClient.start(user, cb).fail(errorHandler);
      });
    },
    getMessageClient: function () {
      return this.messageClient;
    },
    sendMessage: function (recipient, text, errorHandler) {
      this.getMessageClient()
        .send(this.getMessageClient().newMessage(recipient, text))
        .fail(errorHandler);
    },
    onIncomingMessage: function (handler) {
      this.getMessageClient().addEventListener({
        onIncomingMessage: handler
      });
    },
    onMessageDelivered: function (handler) {
      this.getMessageClient().addEventListener({
        onMessageDelivered: handler
      });
    }
  };

  return serviceInstance;

})

;