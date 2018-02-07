//======Setup=======

//Dependencies - External
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');
var express = require('express');

var app = express();



const index = require("./routes/api-routes.js");



//Dependencies - Internal
var Article = require("./models/Article.js");
var Comment = require("./models/Comment.js");

//Add Body Parser Middlewarß
app.use(bodyParser.urlencoded({
  extended: false
}));

//Use public directory
app.use(express.static('public'));

//Mongoose - Configure and connect to the database 

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scrapeGoose");
mongoose.connection.on('open', () => console.log('🌎 Mongoose connected!'));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.use(express.static('public'));
// Sets up the Express app to handle data parsing

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: "application/vnd.api+json"
}));
app.use("/", index);

//======Routes=======

//Home route



var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("News Scraper is listening on ", port);
});

