var express = require('express');
var path = require('path');
var Handlebars = require('handlebars');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');

var app = express();


var db = 'mongodb://sanslan:Troyan88@ds255319.mlab.com:55319/sn-express-blog';

mongoose.connect(db);

app.use(express.static(path.join(__dirname, 'public')));



app.engine('hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs',
	helpers: {
	    striptScript: context =>  {return new Handlebars.SafeString(context)},
	}
}));
app.set('view engine', 'hbs');


//Blog routes
var homeRoutes = require('./routes/homeRoutes');
var singlePost = require('./routes/singlePost');

app.use('/', homeRoutes);
app.use('/post', singlePost);

var Post = require('./models/posts');
app.get('/addbook', function(req, res) {
  var newPost = new Post();

  newPost.title = "Menim postum23";
  newPost.body = "Menim postumun metni budur23";
  newPost.description = "Menim postumun metni budur23";
  newPost.url = "post23";

  newPost.save(function(err, book) {
    if(err) {
      res.send('error saving book');
    } else {
      console.log(book);
      res.send(book);
    }
  });
});

app.listen(3000);