angular.module("Wisen.coinbaseLogin", [
])

.factory("$constant", function () {
  return {
    getKey: function () {
      return '2aaf1febcef8afc5a59682e6b673d3d87299738759237e8b50b649992813eec7';
    },
    getSecret: function () {
      return '31f1a0873bd8597eb732c9bf74daaf5f8e190e94f80af86b76bac6326f83a77a';
    },
    getUrl: function () {
      return 'http://wisen.mod.bz';
    }
  };
})

.factory("$coinbase", function ($constant, $http) {

  var serviceInstance = {
    login: function () {
      var url = "https://www.coinbase.com/oauth/authorize?response_type=code&client_id="
              + $constant.getKey() + "&redirect_uri=" + $constant.getUrl();
      window.redirect(url);
    },
    getToken: function (code, cb) {
      var url = "https://www.coinbase.com/oauth/token&grant_type=authorization_code&code="
              + code + "&redirect_uri=" + $constant.getUrl() + "&client_id="+ $constant.getKey()
              + "&client_secret=" + $constant.getSecret();
      $http.post(url, {})
           .success(function (data, status, headers, config) {
             cb(data.access_token);
           })
           .fail(function (data, status, headers, config) {
             console.log(data, status, headers, config);
             cb();
           });
    }
  };

  return serviceInstance;

})

;