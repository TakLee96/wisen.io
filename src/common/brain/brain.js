angular.module("Wisen.brain", [
  'Wisen.firebaseTwitterLogin'
])

.factory("$brain", function ($login) {

  var ref = $login.getRef();

  var serviceInstance = {
    figureOutBestMentorByTag: function (tag, locations, cb) {
      var list = this.__sort__(locations);

      var next = function (i) {
        if (i === list.length) {
          cb(null);
          return;
        }
        var uid = list[i].key;
        console.log(uid);
        ref.child("users").child(uid).child("tags").child(tag.toLowerCase()).once("value", function (snap) {
          console.log("uid[%s] tags[%s] snap[%s]", uid, tag, snap.val());
          if (snap.val() !== null && snap.val()) {
            cb(uid);
          } else {
            next(i+1);
          }
        });
      };

      next(0);
    },
    figureOutBestMentorByLocation: function (locations) {
      var list = this.__sort__(locations);
      return list[0]; //the nearest
    },
    __sort__: function (dict) {
      var list = [];
      for (var key in dict) {
        list.push(dict[key]);
      }
      list.sort(function compareTo(loc1, loc2) {
        return loc1.distance - loc2.distance;
      }); 
      return list;
    }
  };

  return serviceInstance;

})

;