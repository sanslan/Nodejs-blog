var express = require('express');
var fs = require('fs');
var router = express.Router();
var _ = require('lodash');
var slug = require('slug');
const md5 = require('md5');
const querystring = require('querystring');
var multer = require('multer');
var path =require('path');

var Category = require('../../models/categories');
var Post = require('../../models/posts');

router.get('/create', async function (req, res) {
	var categories = await Category.find({}) ;
	var cats = await Post.findOne().sort({ _id: -1 }) ;

	res.render("admin/createPost",{
		layout: 'admin',
		categories: categories
	})
 });


async function getPosts(curPage){
	var postPerPage = 20;
	var currentPage = Number.isInteger(parseInt(curPage)) ? parseInt(curPage) : 1;
	var fromPage = (currentPage - 1) * postPerPage;
	var allPostsCount = await Post.find({}).count();
	var numbOfPages = Math.ceil(parseInt(allPostsCount) / postPerPage);
	var pagination = ( numbOfPages > 1) ? _.range(1,(numbOfPages+1)) : false;
	var posts = await Post.find({}).sort({_id: 'descending'}).limit(postPerPage).skip(fromPage).populate('categories');
	return {
		posts : posts,
		numbOfPages: numbOfPages,
		pagination: pagination
	}
}
router.get('/allposts',function (req, res) {

	getPosts(req.query.page).then((responce) =>{
		//console.log(responce.numbOfPages);
		res.render("admin/allPosts", {
			layout: 'admin',
			posts: responce.posts,
			numbOfPages: responce.numbOfPages,
			pagination: responce.pagination
		})
	});


});

router.delete('/delete/:id', function (req, res) {
	var rootPath= path.dirname(require.main.filename)
	Post.findByIdAndRemove(req.params.id, (err,doc) => {
		if (err) return res.redirect('/admin/post/allposts');
		var filePath = rootPath+"/uploads/"+doc.thumbnail;
		if(fs.existsSync(filePath)){
			fs.unlinkSync(rootPath+ '/uploads/'+doc.thumbnail);
		}
		return res.redirect('/admin/post/allposts');
	});

});

router.get('/edit/:id',async function (req, res) {
	var selectedCategories;
	
	var post = await Post.findById(req.params.id).populate('categories');
	var categories = await Category.find({});
	categories = JSON.parse(JSON.stringify(categories));
	categories = categories.map((category) =>{
		category.selected=false;
		return category;
	})
	var postCategories = JSON.parse(JSON.stringify(post.categories));
	if(postCategories){
		selectedCategories =postCategories.map((category) =>{
			category.selected= true;
			return category;
		})
		
	}else{
		selectedCategories = [];
	}

	var allCategories = selectedCategories.concat(categories);
	var uniqCategories = _.uniqBy(allCategories,'name');

	res.render("admin/editPost",{
		layout: 'admin',
		post: post,
		thumbnail: '/images/'+post.thumbnail,
		categories: uniqCategories
	})

});

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname))
	}
})

var upload = multer({ storage: storage })

router.post('/', upload.single('file'), async function (req, res) {
	var inputs = req.body;

	var newPost = new Post();
	newPost.title=inputs.title;
	newPost.body=inputs.body;
	if(req.file){
		newPost.thumbnail = req.file.filename;
	}
	if(inputs.categories){
		if (Array.isArray(inputs.categories)) {
			inputs.categories.forEach((category) => {
				newPost.categories.push(category);
			});
		} else {
			newPost.categories.push(inputs.categories);
		}
	}

	if(inputs.tags){
		var tagsArray = inputs.tags.split(",");

		tagsArray.forEach((tag) => {
			newPost.tags.push(tag);
		})
	}

	newPost.save(async function (err, book) {
		if (err) {
			var err_array = ['title error','body error'];
			req.session.arr = 'err_array';
			res.redirect("/admin/post/create");
			//res.send(err);

		} else {
			res.redirect('/admin/post/allposts')
		}
	});
});

router.put('/', upload.single('file'), async function (req, res) {
	var tags,thumbnail;
	if(req.body.tags){
		tags=req.body.tags.split(",");
	}else{
		tags= [];
	}
	if(req.file){
		thumbnail = req.file.filename;
	}else{
		thumbnail=null;
	}

	Post.findByIdAndUpdate(
		req.body.id,
		{
			title: req.body.title,
			body: req.body.body,
			categories: req.body.categories,
			tags: tags,
		},
		(err,doc) =>{
			if(err){
				console.log(err)
			}
			else{
				res.redirect('/admin/post/allposts')
			}
		}

	)
});
module.exports = router;
