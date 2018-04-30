var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var categorySchema = new Schema({
	name: {
	  type: String,
	  required: true,
	  unique: true
	},
	url: {
	    type: String,
	    required: true,
	    unique: true
	}

});

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;