var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/gas');

// get all
router.get('/all', function(req, res, next) {
	db.prices.find({}).sort({date: -1} ,function(error, data) {
		if (error) {
			res.send(error);
		}
		res.json(data);
	})
});

// Find by place id
router.get('/place/:id', function(req, res, next) {
	db.prices.find({}).sort({date: -1} ,function(error, data) {
		if (error) {
			res.send(error);
		}
		var returnData = [];
		for (item in data[0].places.place) {
			var _item = data[0].places.place[item];
			if (_item.item.place_id == req.params.id) {
				returnData.push(_item);
			}
		}
		res.json(returnData);
	})
});

// Find by fuel type (regular,premium,diesel)
router.get('/type/:type', function(req, res, next) {
	db.prices.find({}).sort({date: -1} ,function(error, data) {
		if (error) {
			res.send(error)
		}
		var returnData = [];
		for (item in data[0].places.place) {
			var _item = data[0].places.place[item];
			if(_item.gas_price) {
				var gasPrice = _item.gas_price;
				for (var i = 0; i < gasPrice.length; i++) {
					if (gasPrice[i].item.type == req.params.type) {
						returnData.push(_item);
					}
				}
			}
		}
		res.json(returnData);
	})
});


module.exports = router;	