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
.factory("$sinch", function ($login, $constant, $rootScope) {

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
    sendMessage: function (text, errorHandler) {
      this.getMessageClient()
        .send(this.getMessageClient().newMessage(this.getSinchUsername(), text))
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
    },
    registerRecipient: function (recipient) {
      if (!recipient) {
        console.log("registering empty recipient!!!");
        return;
      }
      if (!recipient.recipientUID) {
        console.log("NO recipientUID");
        return;
      }
      if (!recipient.recipientName) {
        console.log("NO recipientName");
        return;
      }
      console.log("Registering Recipient");
      console.log(recipient);
      this.recipientUID = recipient.recipientUID;
      this.recipientName = recipient.recipientName;
      $rootScope.$emit("recipientRegistered", recipient); 
    },
    getImageURL: function (cb) {
      $login.getRef().child("users").child(this.recipientUID).child("profileImageURL").once("value", function (img) {
        cb(img.val());
      }.bind(this));
    },
    recipientUID: null,
    recipientName: null,
    getName: function () {
      return this.recipientName;
    },
    getSinchUsername: function () {
      console.log("getSinchUsername");
      console.log(this.recipientUID);
      console.log(this.recipientName);
      return this.recipientUID.slice(8);
    }
  };

  return serviceInstance;

})

;