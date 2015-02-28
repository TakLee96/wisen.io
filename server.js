var express = require('express');
var app = express();
var logger = require('./logger')

app.use(logger);
app.use(express.static('bin'));

app.listen(process.env.PORT || 8000, function () {
  console.log("[Server] listening on port", this.address().port);
});