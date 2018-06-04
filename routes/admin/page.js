var express = require('express');
var router = express.Router();
var Page = require('../../models/page');

router.get('/create', function (req, res) {
    res.render("admin/createPage",{layout: 'admin'})
    //res.send('page create')
 });

router.get('/edit/:id',async function (req, res) {
    var selectedPage =await Page.findOne({_id: req.params.id});
    res.render("admin/createPage",{
        layout: 'admin',
        selectedPage: selectedPage
    })
 });

router.get('/allpages',async function (req, res) {
    var pages =await Page.find({});
    res.render("admin/allPages",{
        layout: 'admin',
        pages: pages
    })
    //res.send('page create')
 });

router.post('/', function (req, res) {
     var newPage = new Page();
     newPage.title = req.body.title;
     newPage.body = req.body.body;
     newPage.save( (err,page) =>{
         if(err){
            console.log(err)
         }else{
            res.redirect('/admin/page/create')
         }
            
         
     })
    
 });

router.put('/', function (req, res) {
    Page.findByIdAndUpdate(
		req.body.id,
		{
			title: req.body.title,
			body: req.body.body,
		},
		(err,doc) =>{
			if(err){
				console.log(err)
			}
			else{
				res.redirect('/admin/page/allpages')
			}
		}

	)
});

module.exports = router;