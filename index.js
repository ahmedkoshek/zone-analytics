var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var routes = require('./routes/pages');
var api = require('./routes/api');
var request = require('request');
var fs = require('fs');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cookieParser(app.get('cookieSecret')));
app.use(session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
}));

app.use(express.static(path.join(__dirname, 'client')));

zone_file = path.join(__dirname, '/storage/zone_file.txt')
fs.readFile(zone_file, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  data = data.split(/\r?\n/);
  var lines = [];
  for(var i = 0; i < data.length; i++){
      lines.push(data[i].split(/[ ]+/));
      console.log(data[i].split(/[ ]+/));
  }
});

app.use('/api', api);
app.use(routes);

app.listen(3000, function(){
  console.log("Koshek's server is running ...");
});
