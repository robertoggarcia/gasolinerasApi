var https = require('https');
var async = require('async');
var Q = require('q');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var mongojs = require('mongojs');
var fs = require('fs');
var db = mongojs('mongodb://localhost:27017/gas');

var urlPrices = "https://publicacionexterna.azurewebsites.net/publicaciones/prices";
var urlPlaces = "https://publicacionexterna.azurewebsites.net/publicaciones/places";

var httpGet = function (opts) {
    var deferred = Q.defer();
    https.get(opts, deferred.resolve);
    return deferred.promise;
};

var loadBody = function (res) {
    var deferred = Q.defer();
    var body = "";
    var data = "";
    res.on("data", function (chunk) {
    	data += chunk.toString();
    });
    res.on("end", function () {
    	parser.parseString(data, function(err, result) {
			result.date = new Date();
			var obj = JSON.stringify(result);
			deferred.resolve(obj);
		});
    });
    return deferred.promise;
};

function saveData(data, collection) {
	var deferred = Q.defer();
	db[collection].save(JSON.parse(data), function(error, data) {
		if (error) {
		  deferred.resolve(false);
		  console.log(error);
		} else {
			deferred.resolve(true);
			console.log("Saved " + collection + " data.");
		}
	});
	return deferred.promise;
}

function requestAndSaveData(url, collection) {
	var deferred = Q.defer();
	httpGet(url).then(loadBody).then(function (res) {
		var stringJson = JSON.stringify(res);
		var resultReplace = replaceall("$", "item", stringJson);
        var obj = JSON.parse(resultReplace);
        saveData(obj, collection).then(function(result){
			deferred.resolve(result);
		});
	});
	return deferred.promise;
}

requestAndSaveData(urlPlaces, "places").then(function(res) {
	if (res){
		requestAndSaveData(urlPrices, "prices").then(function(res) {
			if (res) {
				console.log("Ready!");
				process.exit();
			} else {
				console.log("Error");
			}
		});
	} else {
		console.log("Error");
	}
});