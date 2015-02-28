angular.module("Wisen.firebaseTwitterLogin", [
  "firebase"
])

.factory("$login", function () {
  var ref = new Firebase("https://wisen.firebaseio.com/");

  var serviceInstance = {
    uid: null,
    login: function (cb) {
      ref.authWithOAuthPopup("twitter", function (error, OAuth) {
        if (error) {
          cb(error, null);
        } else {
          this.uid = OAuth.uid;
          cb(null, OAuth.uid);
        }
      }.bind(this), { remember: "sessionOnly" });
    },
    getUid: function () {
      return this.uid;
    }
  };

  return serviceInstance;
})

;