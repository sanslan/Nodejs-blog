var express = require('express');
var router = express.Router();
var Post = require('../models/posts');

router.get('/',async function (req, res) {
	var limit = 3;

	var page = req.query.page ? req.query.page : 1;

	var nextPage = parseInt(page)+1;
	var prevPage = parseInt(page)-1;
	var isFirstPage = (page == 1) ? true: false;
	var isLastPage = (page == 1) ? true: false;

	var sum;

	var count  = await Post.aggregate([
	    {
	        $group: {
	            _id: null,
	            count: {$sum: 1}
	        }
	    }
	]);
	sum = count[0].count;
	var posts = await Post.find({})
	    		.skip((page-1)*limit)
	    		.limit(limit)
	res.render('index',{posts: posts,nextPage:nextPage,prevPage:prevPage,isFirstPage: isFirstPage,sumPages: sum});
	//res.render( 'test', { sumPages: count[0].count});

	// .then( (count) => {
	//      	sum=count[0].count
	// })
	// .then(() =>{
 //     	Post.find({})
 //     		.skip((page-1)*limit)
 //     		.limit(limit)
 //     		.then((posts) =>{
 //     			posts=posts;
 //     	})
	// })
	// .then( () =>{
	// 	res.render('index',{posts: posts,nextPage:nextPage,prevPage:prevPage,isFirstPage: isFirstPage,sumPages: sum});
	// } )
});
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds');
});

module.exports = router;