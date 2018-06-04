var mongoose = require('mongoose');
var mlab='mongodb://sanslan:Troyan88@ds255319.mlab.com:55319/sn-express-blog';
var localdb='mongodb://localhost/blog'
var db = localdb;

mongoose.connect(mlab);