//jshint esversion:6
const express = require("express");
const bodyParser= require("body-parser");

const request = require("request");
const https=require("https");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

//To serve static files such as images, CSS files, and JavaScript files
//use the express.static built-in middleware function in Express.
app.use(express.static("public"));

//app.get() is a function that tells the server what to do when a get request at the given route is called.
//It has a callback function (req, res) that listen to the incoming request req object
//and respond accordingly using res response object.
//Both req and res are made available to us by the Express framework.
app.get('/', function (req, res){
  res.sendFile(__dirname+"/signup.html");
});
//The req object represents the HTTP request and has properties for the request query string, parameters, body, and HTTP headers.
//The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
app.post('/',  function (req, res){
  var fname=req.body.fname;
  var lname=req.body.lname;
  var email=req.body.email;
  const data={
    members:[
      {
        email_address : email,
        status : "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname
        }
      }
    ]
  };
  const jsonData=JSON.stringify(data); //data we need to send to mailchimp

// https.get(url,function)
// only makes get request when we want data from external resource
//but in this case we want to post to external resource

  const url="https:us6.api.mailchimp.com/3.0/lists/244f5c449b";
  const options={
    method:"POST",
    auth: "sart:814bd758c149f3836c0059fd93066d75-us6" //username:api key
  };


  // response fron the mail chimp server


// we use http.request to send the data to the server and await the response.
// The response is stored in the request variable, and upon error, it is logged into the console.
// On successful transmission, the data is posted to the server.
  const request=https.request(url,options,function(response){
    if(response.statusCode==200){
      res.sendFile(__dirname+"/success.html");
    }
    else {
      res.sendFile(__dirname+ "/failure.html");
    }
    response.on("data",function(data){
      //responding to the data we get
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);      //data is posted
  request.end();
});

app.post('/failure',function(req,res){
  res.redirect('/');
});

app.listen(process.env.PORT || 3000,function(){
  console.log("server started");
});

//
// api key
// fc86c64f6f539aa293cbb3e25cd3d196-us6

///unique
//244f5c449b


// GET: GET method is used to establish connections and receive info from the server.
//      It is used while making API calls, where no modification of data is involved.
// POST: The POST method is generally used to send data inside the entity-body section.
//      Authentication, File Uploads, etc. are all done via POST method requests.
// DELETE: This method is used to delete resources on the server.
// PUT: This method is used to replace existing resources on the server with the updated resources.
// HEAD: Functions similarly to GET, but sends the message request without the entity-body.
//      This is used in cases when the server must not return the message-body in the response.
//      Or in cases when the files being accessed are too large to be transmitted.
// OPTIONS: This method is used when the client wants to understand the various communication methods that the server supports.
// TRACE: Used for testing purposes. The message is sent from the client to the server, and the route is logged.
