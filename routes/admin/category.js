var express = require('express');
var router = express.Router();
var _ = require('lodash');
var slug = require('slug');
const querystring = require('querystring');


var Category = require('../../models/categories')
var render = require('./includes/functions.js');

router.get('/',async function (req, res) {

	var page = req.query.page ? req.query.page : 1;
	var categoryPerPage = 5;
	var from = (parseInt(page) - 1) * categoryPerPage;
	var allCategoriesCount = await Category.find({}).count();
	var pageCount = Math.ceil(parseInt(allCategoriesCount) / categoryPerPage);
	var pagination = pageCount > 1 ? _.range(1, pageCount + 1) : null;
	var curPage = parseInt(req.query.page);
	var categories = await Category.find({}).skip(from).limit(categoryPerPage);
	render.renderCategories(res, categories, undefined, undefined, pagination, curPage ); 

 });

router.get('/edit/:id', async function (req, res) {

	var page = req.query.page ? req.query.page : 1;
	var categoryPerPage = 5;
	var from = (parseInt(page) - 1) * categoryPerPage;
	var allCategoriesCount = await Category.find({}).count();
	var pageCount = Math.ceil(parseInt(allCategoriesCount) / categoryPerPage);
	var pagination = pageCount > 1 ? _.range(1, pageCount + 1) : null;
	var curPage = parseInt(req.query.page);
	var categories = await Category.find({}).skip(from).limit(categoryPerPage);

	var parentCategories = await Category.find({}).where('_id').ne(req.params.id);
	var selectedCategory = await Category.find({_id: req.params.id});
	render.renderCategories(res, categories, selectedCategory[0], parentCategories, pagination, curPage);

});

router.delete('/delete/:id', async function (req, res) {
	Category.findByIdAndRemove(req.params.id, (err) => {
		if (err) return res.redirect('/admin/category');
		return res.redirect('/admin/category');
	});
});

router.put('/', function (req, res) {

	var updatedCategory=new Category({
		name: req.body.name,
		url: req.body.link,
		parent: req.body.parent
	});
	var newData = updatedCategory.toObject();
	delete newData._id;
	
	Category.update({ _id: req.body.id }, newData, { multi: false },async function (err) {
		if (err) {
			 throw err;
		} else{
			res.redirect('/admin/category');
		}

	})
});

router.post('/', function (req, res) {

	var newCategory = new Category();
	newCategory.name=req.body.name;
	var url = req.body.link ? req.body.link : req.body.name;
	newCategory.url=slug(url);
	newCategory.parent=req.body.parent;

	newCategory.save(async function (err, book) {
		if (err) {
			const query = querystring.stringify({
				error: true,
				"a": 1,
				"b": 2,
				"valid": "your string here"
			});
			res.redirect('/admin/category?'+query);

		} else {
			res.redirect('/admin/category');
		}
	});

});
module.exports = router;