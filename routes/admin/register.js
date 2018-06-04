var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.get('/', function (req, res) {

    res.render("admin/register",{layout: false})

 });

router.post('/', function (req, res) {

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
        var userData = {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        }
        //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
          if (err) {
            console.log(err);
            return next(err)
          } else {
            return res.redirect('/admin');
          }
        });
      }
    //res.render("admin/register",{layout: false})

});

module.exports = router;