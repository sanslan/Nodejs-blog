var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

// create a schema
var pageSchema = new Schema({
  title:{
    type: String,
    required: 'Title must not be empty',
    unique: true
  },
  body:{
    type: String,
    required: 'Post body must not be empty'
  },
});
pageSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });
var Page = mongoose.model('Page', pageSchema);

// make this available to our users in our Node applications
module.exports = Page;