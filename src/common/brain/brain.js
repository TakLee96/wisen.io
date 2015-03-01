angular.module("Wisen.brain", [
  'firebaseTwitterLogin'
])

.factory("$brain", function ($login) {

  var ref = $login.getDefaultRef();

  var serviceInstance = {
    figureOutBestMentorByTag: function (tag, locations, cb) {
      var list = this.__sort__(locations);
      setTimeout(function () {
        for (var k = 0; k < list.length; k++) {
          $login.getDefaultRef().child(list[k].key).child("tags").off("child_added");
        }
        cb(null);
      }, 5000);
      for (var i = 0; i < list.length; i++) {
        this.__iter__(list, list[i], tag, cb);
      }
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
    },
    __iter__: function (list, location, tag, cb) {
      var tagRef = $login.getDefaultRef().child(location.key).child("tags");
      tagRef.on("child_added", function (tagObj) {
        if (tagObj.val() === tag) {
          for (var j = 0; j < list.length; j++) {
            $login.getDefaultRef().child(list[j].key).child("tags").off("child_added");
          }
          cb(location);
        }
      });
    }
  };

  return serviceInstance;

})

;