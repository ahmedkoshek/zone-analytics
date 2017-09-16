var express = require('express');
var router = express();
var path = require('path');
var fs = require('fs');

router.post('/upload', function(req,res){
  data = data.split(/\r?\n/);
  var lines = [];
  for(var i = 0; i < data.length; i++){
      lines.push(data[i].split(/[ ]+/));
  }
  console.log(lines[0][0])
});


 router.get('/process', function(req,res){
   request('https://www.whois.com/whois/yahoo.xyz', function (error, response, body) {
     if (!error && response.statusCode == 200) {
       console.log(body) // Print the google web page.
     }
   });
 });



module.exports = router;
