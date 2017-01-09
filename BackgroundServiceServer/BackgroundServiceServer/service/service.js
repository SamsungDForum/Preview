var dataRequester = require("./dataRequester");

var messagePortName = 'FOREGROUND_APP_PORT';
var localPort = '';

// Mandatory Callbacks for Service application
// onStart Callback
module.exports.onStart = function() {
	console.log('Start Callback');
	initMessagePort();
}

// onRequest Callback
module.exports.onRequest = function() {
	console.log('Request Callback');
}

// onExit Callback
module.exports.onExit = function() {
	console.log('Exit Callback');
}

// get Metadata from foreground Application
function getMetadataCallback(previewData) {
	console.log('getMetadataCallback');

	try {
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
	} catch(e) {
		console.log('setPreviewData exception : ' + e.message);
	}
}

// receive data from foreground application
function initMessagePort() {
	function onReceived(data, remotePort) {
		console.log('onReceived : ' + JSON.stringify(data) + ' remotePort : ' + remotePort);

		data.forEach(function(item) {
			console.log('item : ' + JSON.stringify(item));

			if (item.key == 'METADATA') {
				var urlData = JSON.parse(item.value);

				if (urlData.type == 'http') {
					dataRequester.performHttpRequest(urlData.host, urlData.endpoint, getMetadataCallback);
				} else if (urlData.type == 'https') {
					dataRequester.performHttpsRequest(urlData.host, urlData.endpoint, getMetadataCallback);
				}
			}
		});
	}
	
	try {
        console.log('request local message port ' + messagePortName);
        localPort = tizen.messageport.requestLocalMessagePort(messagePortName);
    } catch (e) {
        console.log('request message port error : ' + e.message);
    }
    
    try {
    	console.log('addMessagePortListener');
    	localPort.addMessagePortListener(onReceived);
    } catch (e) {
    	console.log('add message port listener error : ' + e.message);
    }
}