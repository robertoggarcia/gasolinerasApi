var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/gas');

// get all
router.get('/all', function(req, res, next) {
	db.places.find({}).sort({date: -1} ,function(error, data) {
		if (error) {
			res.send(error);
		}
		res.json(data);
	})
});

// Find by place id
router.get('/place/:id', function(req, res, next) {
	db.places.find({}).sort({date: -1} ,function(error, data) {
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

// Find by location and radius
// http://localhost:3002/places/location/32.47641,-116.9214/6
router.get('/location/:location/:radius', function(req, res, next) {
	db.places.find({}).sort({date: -1} ,function(error, data) {
		if (error) {
			res.send(error)
		}
		
		var returnData = [];
		for (item in data[0].places.place) {
			var _item = data[0].places.place[item];
			if(_item.location && req.params.location && req.params.radius) {
				var lat = _item.location[0].y;
				var lon = _item.location[0].x;
				var locationSearch = req.params.location.split(",");
				var radius = req.params.radius;
				var distance = getDistanceFromLatLonInKm(lat, lon, locationSearch[0], locationSearch[1]);
				if (distance <= radius) {
					_item.distance = distance;
					returnData.push(_item);
				}
			}
		}
		res.json(returnData);
	})
});

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371;
  var dLat = (lat2-lat1) * (Math.PI/180);
  var dLon = (lon2-lon1) * (Math.PI/180);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

module.exports = router;