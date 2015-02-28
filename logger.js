var counter = 0;
var placeholder = "         ";

module.exports = function (req, res, next) {
  var num = ++counter;
  console.log("[Server] Request #%s %s %s", num, req.method, req.url);
  var start = +new Date();
  res.on('finish', function () {
    var end = +new Date();
    console.log(placeholder+"#%s Complete in %sms", num, end-start);
  });
  next();
};