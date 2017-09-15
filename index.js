var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var routes = require('./routes/pages');
var api = require('./routes/api');


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

app.use(express.static(path.join(__dirname, 'client/dist')));


app.use('/api', api);
app.use(routes);

app.listen(3000, function(){
  console.log("Koshek's server is running ...");
});
