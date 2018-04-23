var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var postSchema = new Schema({
  title: String,
  body: String,
  description: String,
  url: {
    type: String,
    required: true,
    unique: true
  }

});

var Post = mongoose.model('Post', postSchema);

// make this available to our users in our Node applications
module.exports = Post;