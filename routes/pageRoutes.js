var express = require('express');
var router = express.Router();
var Page = require('../models/page');

router.get('/:id', function (req, res) {
	var id = req.params.id;

	Page.findOne({"title": id})
		.exec(function(err, page) {
		    if(err) {
		      res.send('error occured')
		    } else {
					res.render('page',{page: page});		
		    }
	  });
 });
module.exports = router;