// request Data (http/https)

var querystring = require('querystring');
var http = require('http');
var https = require('https');

function performHttpsRequest(host, endpoint, successCallback) {
	console.log('host : ' + host + ', endpoint : ' + endpoint);

	var options = {
			host: host,
			port : 443,
	        path : endpoint,
	        method : 'GET'			
	};
		
	var req = https.request(options, function(res) {
		console.log('status code: ' + res.statusCode);
       
		res.setEncoding('utf-8');
		
		var responseString = '';
		res.on('data', function(data) {
			responseString += data;
		});
		
		res.on('end', function() {
			var responseObject = JSON.parse(responseString);
			successCallback(responseObject);
		});
	});

	req.end();
	req.on('error', function(e){
		console.log('Error: ' + e.message);
    });
}

function performHttpRequest(host, endpoint, successCallback) {
	console.log('host : ' + host + ', endpoint : ' + endpoint);

	var options = {
			host: host,
			port : 80,
	        path : endpoint,
	        method : 'GET'			
	};
		
	var req = http.request(options, function(res) {
		console.log('status code: ' + res.statusCode);
       
		res.setEncoding('utf-8');
		
		var responseString = '';
		res.on('data', function(data) {
			responseString += data;
		});
		
		res.on('end', function() {
			var responseObject = JSON.parse(responseString);
			successCallback(responseObject);
		});
	});

	req.end();
	req.on('error', function(e){
		console.log('Error: ' + e.message);
    });
}

exports.performHttpsRequest = performHttpsRequest;
exports.performHttpRequest = performHttpRequest;
