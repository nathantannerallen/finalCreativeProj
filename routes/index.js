var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Voting = mongoose.model('Voting');

router.param('product', function(req, res, next, id) {
  var query = Voting.findById(id);
  query.exec(function (err, product){
    if (err) { return next(err); }
    if (!product) { return next(new Error("can't find product")); }
    req.product = product;
    return next();
  });
});

router.get('/voting/:product',function(req,res) {
  res.json(req.product);
});

router.put('/voting/:product/upvote', function(req, res, next) {
  console.log("Put Route"+req.product.Name);
  req.product.upvote(function(err, product){
    if (err) { return next(err); }
    res.json(product);
  });
});

router.delete('/voting/:product',function(req,res) {
  req.product.remove();
  res.sendStatus(200);
});

router.get('/voting', function(req, res, next) {
  console.log("Get Route");
  Voting.find(function(err, products){
    if(err){ console.log("Error"); return next(err); }
    res.json(products);
  console.log("res.json Get Route");
  }).sort({'Name':1});
  console.log("returningGet Route");
});

router.post('/voting', function(req, res, next) {
  console.log("Post Route");
  var product = new Voting(req.body);
  console.log("Post Route");
  console.log(product);
  product.save(function(err, product){
		console.log("Error "+err);
		if(err){  return next(err); }
    console.log("Post Route before json");
		res.json(product);
	});
});

module.exports = router;
