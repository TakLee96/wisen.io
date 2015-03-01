angular.module("Wisen.firebaseTwitterLogin", [
  "firebase"
])

.factory("$local", function () {
  return {
    userIsCached: function () {
      return (typeof(Storage) !== "undefined" && localStorage.getItem("uid") !== null);
    },
    localStorageIsAvailable: function () {
      return typeof(Storage) !== "undefined";
    },
    getUid: function () {
      return localStorage.getItem("uid");
    },
    getName: function () {
      return localStorage.getItem("name");
    },
    setUid: function (uid) {
      localStorage.setItem("uid", uid);
    },
    setName: function (name) {
      localStorage.setItem("name", name);
    },
    clear: function () {
      localStorage.removeItem("uid");
      localStorage.removeItem("name");
    }
  };
})

.factory("$login", function ($local) {
  var ref = new Firebase("https://wisen.firebaseio.com/");

  var serviceInstance = {
    uid: null,
    name: null,
    ref: ref,
    login: function (cb) {
      if ($local.userIsCached()) {
        cb(null, $local.getUid(), $local.getName());
      } else {
        ref.authWithOAuthPopup("twitter", function (error, OAuth) {
          if (error) {
            cb(error, null, null);
          } else {
            this.uid = OAuth.uid;
            this.name = OAuth.twitter.displayName;
            if ($local.localStorageIsAvailable()) {
              $local.setUid(this.uid);
              $local.setName(this.name);
            }
            this.update(OAuth.twitter);
            cb(null, OAuth.uid, OAuth.twitter.displayName);
          }
        }.bind(this));
      }
    },
    getUid: function () {
      return this.uid;
    },
    getName: function () {
      return this.name;
    },
    getRef: function () {
      return this.ref;
    },
    getSinchUsername: function () {
      return this.getUid().slice(8);
    },
    clear: function () {
      $local.clear();
    },
    update: function (twitter) {
      var user = {
        profileImageURL: twitter.cachedUserProfile.profile_image_url,
        displayName: twitter.displayName,
        username: twitter.username
      };
      this.getRef().child('users').child(this.getUid()).update(user);
    },
    getImageURL: function (cb) {
      this.getRef().child("users").child(this.getUid()).child("profileImageURL").once("value", function (data) {
        cb(data.val());
      });
    }
  };

  if ($local.userIsCached()) {
    serviceInstance.uid = $local.getUid();
    serviceInstance.name = $local.getName();
  }

  return serviceInstance;
})

;