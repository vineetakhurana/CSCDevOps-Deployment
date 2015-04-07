var http      = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis') //added
var express = require('express') //added 
var exec = require('child_process').exec;
var request = require("request");

var app = express()

var GREEN = 'http://127.0.0.1:5060';
var BLUE  = 'http://127.0.0.1:9090';

// var client_blue = 6379
// var client_green = 6380 

var flag=1; //flag for mirroring

var client_B = redis.createClient(6379, '127.0.0.1', {}) //Blue redis instance
var client_G = redis.createClient(6380, '127.0.0.1', {}) //Green redis instance

//var multi = client_G.multi()

var TARGET = BLUE; //defalut target is BLUE

// var set_val_blue;
// var set_val_green;

var newArray = []
var otherArray = []

var infrastructure =
{
  setup: function()
  {
    // Proxy.
    var options = {};
    var proxy   = httpProxy.createProxyServer(options);

    var server  = http.createServer(function(req, res)
    {
          
       if(req.url == "/switch"){  //for intercepting the /switch request
          console.log("in switch");
          if(TARGET == BLUE) {
            console.log("changing from blue to green")  //need to switch to Green if in Blue
        
              client_B.lrange('items', 0,-1, function(err,reply){

                  newArray = reply;  //contents of blue's image queue 'items' to temp-array
                  //console.log(reply);
                  //reply.forEach(function (item){
                     // newArray.push(item);
                  console.log("newArr:",newArray.length);

                  for(var i=0; i<newArray.length;i++)
                   {
                      client_G.rpush(['items', newArray[i]] ,function(err,reply){ //contents pushed to green's queue 'items'

                      });
                    }
              });
           TARGET = GREEN  //setting the target as Green to switch proxy's target
        
          }
          else if (TARGET == GREEN){ 
          console.log("changing from green to blue")

          client_G.lrange('items', 0,-1, function(err,reply){

                  newArray = reply;
                  //console.log(reply);
                  //reply.forEach(function (item){
                     // newArray.push(item);
                  console.log("newArr:",newArray.length);

                  for(var i=0; i<newArray.length;i++)
                  {
                      client_B.rpush(['items', newArray[i]] ,function(err,reply){

                     });
                  }
              });
            TARGET = BLUE
          }

          req.url = "/" //so that switch routes to welcome page
          proxy.web( req, res, {target: TARGET } );
        }

        else //for every other req
          proxy.web( req, res, {target: TARGET } );


      //mirroring code
       if(flag == 1){ 
        if(req.method == "POST") //intercept the post request
        {
          if(TARGET==BLUE){
            //proxy.web( req, res, {target: TARGET } );
            TARGET = GREEN;
            proxy.web( req, res, {target: TARGET } );  //send the request to GREEN instance also
          }
          else if(TARGET==GREEN){
            //proxy.web( req, res, {target: TARGET } );
            TARGET = BLUE;
            proxy.web( req, res, {target: TARGET } ); //send the request to GREEN instance also
          }
        }
      }
          
    });
    server.listen(8089);

//address shifting logic
  // http.createServer(function(req,res){
  //     var target = { target: addresses.shift() };
  //     console.log('balancing request to:',target);
  //     proxy.web(req,res,target);
  //     addresses.push(target.target);
  //   }).listen(8089);

    // Launch blue slice
    exec('forever -w --watchDirectory=../deploy/blue-www start ../deploy/blue-www/main.js 9090 6379');  // 9090 is the PORT for BLUE to run and 6379 is the port for GREEN_REDIS instance to run
    console.log("blue slice");

    // Launch green slice
    exec('forever -w --watchDirectory=../deploy/green-www start ../deploy/green-www/main.js 5060 6380'); // 5060 is the PORT for BLUE to run and 6380 is the port for BLUE_REDIS instance to run
    console.log("green slice");

  },

  teardown: function()
  {
    exec('forever stopall', function()
    {
      console.log("infrastructure shutdown");
      process.exit();
    });
  },
}

infrastructure.setup();

// Make sure to clean up.
process.on('exit', function(){infrastructure.teardown();} );
process.on('SIGINT', function(){infrastructure.teardown();} );
process.on('uncaughtException', function(err){
  console.log(err);
  //infrastructure.teardown();
});



