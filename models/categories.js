var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

// create a schema
var categorySchema = new Schema({
	name: {
	  type: String,
	  required: [true,'Ad mutleq olmalidir'],
	  unique: [true,'ad yunik olmalidir']
	},
	url: {
	    type: String,
	    unique: true
	},
	parent: {
		type: String,
		default: 0,
	}

});
categorySchema.plugin(uniqueValidator);
var Category = mongoose.model('Category', categorySchema);

module.exports = Category;