// filesystem module
var fs = require('fs');

var JsonFilePath = 'service/sample.json';
var previewData = {};

// Local JSON data
var localJsonData = {
	"sections" : [ {
		"title" : "Rozanne's recommended",
		"tiles" : [ {
			"title" : "Funny",
			"subtitle" : "27th Birthday Party",
			"image_ratio" : "16by9",
			"image_url" : "https://developer.samsung.com/onlinedocs/tv/Preview/1.jpg",
			"action_data" : "{\"videoIdx\": 1}",
			"is_playable" : true
		} ]
	}, {
		"title" : "20's choice",
		"tiles" : [ {
			"title" : "Rozanne's Living",
			"image_ratio" : "1by1",
			"image_url" : "https://developer.samsung.com/onlinedocs/tv/Preview/2.jpg",
			"action_data" : "{\"videoIdx\": 2}",
			"is_playable" : true
		}, {
			"title" : "Cooking",
			"subtitle" : "Season 1",
			"image_ratio" : "16by9",
			"image_url" : "https://developer.samsung.com/onlinedocs/tv/Preview/3.jpg",
			"action_data" : "{\"pictureIdx\": 3}",
			"is_playable" : false
		}, {
			"title" : "Rozanne's 27th Party",
			"image_ratio" : "16by9",
			"image_url" : "https://developer.samsung.com/onlinedocs/tv/Preview/4.jpg",
			"action_data" : "{\"pictureIdx\": 4}",
			"is_playable" : false
		}, {
			"title" : "Rozanne's Animal",
			"image_ratio" : "16by9",
			"image_url" : "https://developer.samsung.com/onlinedocs/tv/Preview/5.jpg",
			"action_data" : "{\"pictureIdx\": 5}",
			"is_playable" : false
		} ]
	} ]
};

//Mandatory Callbacks for Service application
//onStart Callback
module.exports.onStart = function() {
	console.log('Start Callback');
}

//onRequest Callback
module.exports.onRequest = function() {
	console.log('Request Callback');

	var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();

	if (reqAppControl && reqAppControl.appControl.operation == "http://tizen.org/appcontrol/operation/pick") {
		var data = reqAppControl.appControl.data;
		if (data[0].value[0] == 'ForegroundApp') {
			try {
				var isExist = fs.existsSync(JsonFilePath);
				
				if(isExist) {
					// Json File is exist
					fs.readFile(JsonFilePath, 'utf8', function (error, data) {
						if(error) throw error;
						previewData = JSON.parse(data);
						
						// setPreviewData with preview JSON data
						webapis.preview.setPreviewData(JSON.stringify(previewData),
							function(){
								console.log('setPreviewData SuccessCallback');
								// please terminate service after setting preview data
								tizen.application.getCurrentApplication().exit();
							},
							function(e) {
								console.log('setPreviewData failed : ' + e.message);
							}
						);
					});
				} else {
					// Json File is not exist
					previewData = localJsonData;
					
					// setPreviewData with preview JSON data
					webapis.preview.setPreviewData(JSON.stringify(previewData),
						function(){
							console.log('setPreviewData SuccessCallback');
							// please terminate service after setting preview data
							tizen.application.getCurrentApplication().exit();
						},
						function(e) {
							console.log('setPreviewData failed : ' + e.message);
						}
					);
				}
			} catch(e) {
				console.log('setPreviewData exception : ' + e.message);
			}
		}
	}
}

//onExit Callback
module.exports.onExit = function() {
	console.log('Exit Callback');
}
