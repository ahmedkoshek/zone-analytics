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
var json2csv = require('json2csv');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var forEach = require('async-foreach').forEach;
var dns = require('dns');
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client')));

function saveCSV2(csv1)
{
  //console.log(csv1);
  var newLine= "\r\n";
  var fields = ['DomainName', 'IP', 'IPType', 'Category'];

  var toCsv = {
      data: csv1,
      fields: fields,
      hasCSVColumnTitle: false
  };

  fs.stat('file2.csv', function (err, stat) {
      if (err == null) {
          //console.log('File exists');
          //write the actual data and end with newline
          var csv = json2csv(toCsv) + newLine;

          fs.appendFile('file2.csv', csv, function (err) {
              if (err) throw err;
              console.log('The "data to append" was appended to file!');
          });
      }
      else {
          //write the headers and newline
          console.log('New file, just writing headers');
          fields= (fields + newLine);
          fs.writeFile('file2.csv', fields, function (err, stat) {
              if (err) throw err;
              console.log('file saved');
          });
      }
  });
}

function saveCSV(csv1)
{
  //console.log(csv1);
  var newLine= "\r\n";
  var fields = ['DomainName', 'CreationDate', 'ExpirationDate', 'RegistrarCountry', 'Secured', 'Servers', 'Type'];

  var toCsv = {
      data: csv1,
      fields: fields,
      unwindPath: 'Servers',
      hasCSVColumnTitle: false
  };

  fs.stat('file.csv', function (err, stat) {
      if (err == null) {
          console.log('File exists');
          //write the actual data and end with newline
          var csv = json2csv(toCsv) + newLine;

          fs.appendFile('file.csv', csv, function (err) {
              if (err) throw err;
              console.log('The "data to append" was appended to file!');
          });
      }
      else {
          //write the headers and newline
          console.log('New file, just writing headers');
          fields= (fields + newLine);
          fs.writeFile('file.csv', fields, function (err, stat) {
              if (err) throw err;
              console.log('file saved');
          });
      }
  });
}


zone_file = path.join(__dirname, '/storage/zone_file.txt')
fs.readFile(zone_file, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  data = data.split(/\r?\n/);
  var lines = [];
  for(var i = 0; i < data.length; i++){
      lines.push(data[i].split('\t'));
  }
  var names = [];
  var csv1 = [];
  var itemsProcessed = 0;
  forEach(lines, function(item, i, lines){
    var done = this.async();
    itemsProcessed = itemsProcessed + 1;
    if(lines[i][3] === "ns" || lines[i][3] === "A" || lines[i][3] === "AAAA"){
      if(!names.includes(lines[i][0])){
        names.push(lines[i][0]);
        console.log(lines[i][0]);
        request('https://www.whois.com/whois/'+lines[i][0], function (error, response, body) {
          if (!error && response.statusCode == 200) {
            const dom = new JSDOM(body);
            if(dom.window.document.getElementById("registryData") != null){
                ROWDATA = dom.window.document.getElementById("registryData").innerHTML;
                ROWDATA = ROWDATA.split(/\r?\n/);
                var linesDomain = []
                for(var x=0; x<ROWDATA.length; x++){
                  linesDomain.push(ROWDATA[x].split(':'));
                }
                var domainname = String;
                var creationdate = String;
                var expirationdate = String;
                var registrarcountry = String;
                var secured = String;
                var servers = [];
                for(var index=0; index<linesDomain.length; index++){
                  if(linesDomain[index][0] === "Domain Name"){
                    domainname = linesDomain[index][1];
                  }
                  else if(linesDomain[index][0] === "Creation Date"){
                    creationdate = linesDomain[index][1].split('T')[0];
                  }
                  else if(linesDomain[index][0] === "Registry Expiry Date" || linesDomain[index][0] === "Registrar Registration Expiration Date"){
                    expirationdate = linesDomain[index][1].split('T')[0];
                  }
                  else if(linesDomain[index][0] === "Registrant Country"){
                    registrarcountry = linesDomain[index][1];
                  }
                  else if(linesDomain[index][0] === "DNSSEC"){
                    secured = linesDomain[index][1];
                  }
                  else if(linesDomain[index][0] === "Name Server"){
                    servers.push(linesDomain[index][1]);
                  }
                }
                var csvtemp = {
                  DomainName: domainname,
                  CreationDate: creationdate,
                  ExpirationDate: expirationdate,
                  RegistrarCountry: registrarcountry,
                  Secured: secured,
                  Servers: servers,
                  type: lines[i][3]
                };
                saveCSV(csvtemp);
                //csv1.push(csvtemp);
                csvtemp = {};
              }
            else if(dom.window.document.getElementById("registrarData") != null){
              ROWDATA = dom.window.document.getElementById("registrarData").innerHTML;
              ROWDATA = ROWDATA.split(/\r?\n/);
              var linesDomain = []
              for(var x=0; x<ROWDATA.length; x++){
                linesDomain.push(ROWDATA[x].split(':'));
              }
              var domainname = String;
              var creationdate = String;
              var expirationdate = String;
              var registrarcountry = String;
              var secured = String;
              var servers = [];
              for(var index=0; index<linesDomain.length; index++){
                if(linesDomain[index][0] === "Domain Name"){
                  domainname = linesDomain[index][1];
                }
                else if(linesDomain[index][0] === "Creation Date"){
                  creationdate = linesDomain[index][1].split('T')[0];
                }
                else if(linesDomain[index][0] === "Registry Expiry Date" || linesDomain[index][0] === "Registrar Registration Expiration Date"){
                  expirationdate = linesDomain[index][1].split('T')[0];
                }
                else if(linesDomain[index][0] === "Registrant Country"){
                  registrarcountry = linesDomain[index][1];
                }
                else if(linesDomain[index][0] === "DNSSEC"){
                  secured = linesDomain[index][1];
                }
                else if(linesDomain[index][0] === "Name Server"){
                  servers.push(linesDomain[index][1]);
                }
              }
              var csvtemp = {
                DomainName: domainname,
                CreationDate: creationdate,
                ExpirationDate: expirationdate,
                RegistrarCountry: registrarcountry,
                Secured: secured,
                Servers: servers,
                type: lines[i][3]
              };
              saveCSV(csvtemp);
              //csv1.push(csvtemp);
              csvtemp = {};
            }
            else console.log("SKIP");
          }
          done();
        });
      }
      else {
        done();
      }
    }
    else {
      done();
    }
  });
});


zone_file = path.join(__dirname, '/storage/zone_file_1.txt')
fs.readFile(zone_file, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  data = data.split(/\r?\n/);
  var lines = [];
  for(var i = 0; i < data.length; i++){
      lines.push(data[i].split('\t'));
  }
  var names = []
  var itemsProcessed = 0;
  forEach(lines, function(item, i, lines){
    var done = this.async();
    if(lines[i][3] === "ns" || lines[i][3] === "A" || lines[i][3] === "AAAA"){
      if(!names.includes(lines[i][0])){
        console.log(lines[i][0]);
        names.push(lines[i][0]);
        dns.lookup(lines[i][0], function (err, address, family) {
          if(!err)
            {
              var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
              var natural_language_understanding = new NaturalLanguageUnderstandingV1({
                'username': '5443ebff-f717-49f4-946a-a4789a0d1a3a',
                'password': 'TPiUxcQVlOwb',
                'version_date': '2017-02-27'
              });
              var parameters = {
                'url': lines[i][0],
                'features': {
                  'categories': {},
                  'sentiment':{}
                }
              };
              natural_language_understanding.analyze(parameters, function(err, response) {
                if (err){
                  csv2temp = {
                    DomainName: lines[i][0],
                    IP: address,
                    IPType: family,
                    Category: "Unknown language"
                  }
                  saveCSV2(csv2temp);
                  done();
                }
                else{
                  //console.log(JSON.stringify(response, null, 2));
                  category = "Unknown language";
                  if(response.categories){
                    if(response.categories.length != 0)
                      category = response.categories[0].label.split('/')[1];
                  }
                  csv2temp = {
                    DomainName: lines[i][0],
                    IP: address,
                    IPType: family,
                    Category: category
                  }
                  saveCSV2(csv2temp);
                  done();
                }
              });
            }
            else done();
        });
      }
      else done();
    }
    else done();
  });

});




app.use('/api', api);
app.use(routes);

app.listen(3000, function(){
  console.log("Koshek's server is running ...");
});
