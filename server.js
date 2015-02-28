var express = require('express');
var app = express();
var logger = require('./logger')
var cors = require('cors');

app.use(logger);
app.use(cors());
app.use(express.static('build'));

app.listen(process.env.PORT || 8000, function () {
  console.log("[Server] listening on port", this.address().port);
});