var express = require('express');
var router = express();

//home page
router.get('/', function(req, res){
  res.send();
});

module.exports = router;
