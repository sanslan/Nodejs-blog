var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.get('/', function (req, res) {

    res.render("admin/login",{layout: false})

 });

router.post('/', function (req, res, next) {

    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function (error, user) {
          if (error || !user) {
            res.render("admin/login",{layout: false})
          } else {
            req.session.userId = user._id;
            //console.log(req.session.userId)
            return res.redirect('/admin');
          }
        });
      } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
      }
    //res.render("admin/register",{layout: false})

});

module.exports = router;