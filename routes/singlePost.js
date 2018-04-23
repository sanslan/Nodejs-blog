var express = require('express');
var router = express.Router();
var Post = require('../models/posts');

router.get('/:url', function (req, res) {
	var url = req.params.url;

	Post.findOne({"url": url})
		.exec(function(err, post) {
		    if(err) {
		      res.send('error occured')
		    } else {
		    	res.render('singlePost',{post: post});
		    }
	  });
 });
module.exports = router;