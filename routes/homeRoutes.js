var express = require('express');
var router = express.Router();
var Post = require('../models/posts');
var Category = require('../models/categories');

router.get('/',async function (req, res) {
	var categories = await Category.find({});
	var limit = 3;

	var page = req.query.page ? req.query.page : 1;

	var nextPage = parseInt(page)+1;
	var prevPage = parseInt(page)-1;

	var sum;

	var count  = await Post.aggregate([
	    {
	        $group: {
	            _id: null,
	            count: {$sum: 1}
	        }
	    }
	]);
	if(count > 0){
		sum = count[0].count;
	}
	else{
		sum=0;
	}
	
	var isFirstPage = (page == 1) ? true: false;
	var isLastPage = (page == Math.ceil(sum/limit)) ? true : false;
	var posts = await Post.find({})
	    		.skip((page-1)*limit)
				.limit(limit)
	res.render('index',{
		posts: posts,
		nextPage:nextPage,
		prevPage:prevPage,
		isFirstPage: isFirstPage,
		isLastPage: isLastPage,
		sumPages: sum,
		categories: categories,
	});
});
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds');
});

module.exports = router;