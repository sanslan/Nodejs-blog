var express = require('express');
var path = require('path');
var multer = require('multer');
var session = require('express-session');
var mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

var mlab='mongodb://sanslan:Troyan88@ds255319.mlab.com:55319/sn-express-blog';
var localdb='mongodb://localhost/blog'
var db = localdb;

mongoose.connect(mlab);

var app = express();
//Handlebars config
require('./config/hbsConfig')(app);
var port = process.env.PORT || 3000;

app.set('trust proxy', 1) // trust first proxy

//Sessions
app.use(session({
  secret: 'abc123',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


//require('./config/mongodbConfig');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'uploads')));

//Bodyparser config
require('./config/bodyParserConfig')(app);


//Blog routes
var homeRoutes = require('./routes/homeRoutes');
var singlePost = require('./routes/singlePost');
var categoryRoute = require('./routes/categoryRoutes');
var pageRoute = require('./routes/pageRoutes');

app.use('/', homeRoutes);
app.use('/post', singlePost);
app.use('/category', categoryRoute);
app.use('/page', pageRoute);

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.redirect('/')
  }
}

function isNotRegistered(req, res, next) {
  if (!req.session.userId) {
    return next();
  } else {
    res.redirect('/admin')
  }
}

//Admin routes
var register = require('./routes/admin/register');
var logout = require('./routes/admin/logout');
var login = require('./routes/admin/login');
var adminIndex = require('./routes/admin/index');
var adminPost = require('./routes/admin/post');
var adminCategory = require('./routes/admin/category');
var adminPage = require('./routes/admin/page');

app.use('/admin/register',isNotRegistered, register);
app.use('/admin/logout',requiresLogin, logout);
app.use('/admin/login',isNotRegistered, login);
app.use('/admin',requiresLogin, adminIndex);
app.use('/admin/post',requiresLogin, adminPost);
app.use('/admin/category',requiresLogin, adminCategory);
app.use('/admin/page',requiresLogin, adminPage);

app.get('/admin/test', (req, res, next) => {
  //req.session.sas= "qoca";
  res.send(req.session.sas)
  console.log(req.session.sas);
})

app.listen(port);