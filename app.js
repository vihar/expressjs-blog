var express = require('express');
var app = express();
var port = 3000;

// HTML Rendering Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Database Connection
var mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/express-blog")

// Text Encoding Configure
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

// Data Models - Post Schema
var postSchema = new mongoose.Schema({
    author: {type: String, required: true, unique: false},
    title: {type: String, required: true, unique: false},
    description: {type: String, required: true, unique: true},
});

var Post = mongoose.model('Post', postSchema);


// Listen
app.get("/", (req, res) => {
   Post.find({}, function(err,posts){ 
    res.render('index', {posts});
   }); 
});


// Postform Get Method
app.get("/addpost", (req, res) => {
   res.render('postform');
});


// Postform Post Nethod
app.post('/addpost', (req, res) => {
    var postData = new Post(req.body);
    postData.save().then( result => {
        res.redirect('/');
    }).catch(err => {
        res.status(400).send("Unable to save data");
    });
});

app.listen(port, () => {
    console.log('Server listing on ' + port);
})