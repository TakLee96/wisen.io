angular.module("Wisen.firebaseTwitterLogin", [
  "firebase"
])

.factory("$login", function () {
  var ref = new Firebase("https://wisen.firebaseio.com/")

  var serviceInstance = {
    uid: null,
    name: null,
    ref: ref,
    login: function (cb) {
      ref.authWithOAuthPopup("twitter", function (error, OAuth) {
        if (error) {
          cb(error, null, null);
        } else {
          this.uid = OAuth.uid;
          this.name = OAuth.twitter.displayName;
          cb(null, OAuth.uid, OAuth.twitter.displayName);
        }
      }.bind(this), { remember: "sessionOnly" });
    },
    getUid: function () {
      return this.uid;
    },
    getName: function () {
      return this.name;
    },
    getRef: function () {
      return this.ref;
    }
  };

  return serviceInstance;
})

;