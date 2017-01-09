// Background Service
var bgServiceId = 'g3rACqwer1.service'; // service

function launchService(serviceId) {
    log('Launching... ' + serviceId);

    // Launch Service
    tizen.application.launchAppControl(
    	new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/pick', null, 'imag/jpeg', null, [new tizen.ApplicationControlData('caller',['ForegroundApp'])]), serviceId,
    	function () {
    		//success callback
    		log('Launch success: ' + serviceId);
    	},
    	function (e) {
    		log('Launch failed: ' + e.message);
    	}
    );
}

//Deeplink
var result = '';
var text = '';

var element = '';
var isPlay = false;
var isPaint = false;

var contentsURL = 'https://developer.samsung.com/onlinedocs/tv/Preview/';

function deepLink() {
   	var requestedAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
    var appControlData;
    var actionData;

    var videoIdx;
    var pictureIdx;

    if (requestedAppControl) {
        appControlData = requestedAppControl.appControl.data; // get appcontrol data. action_data is in it.
        text = '[TestApp] appControlData : ' + JSON.stringify(appControlData);
        log(text);

        for (var i = 0; i < appControlData.length; i++) {
            if (appControlData[i].key == 'PAYLOAD') { // find PAYLOAD property.
                actionData = JSON.parse(appControlData[i].value[0]).values; // Get action_data

                if(JSON.parse(actionData).videoIdx) { // in case Tile is video.
                	videoIdx = JSON.parse(actionData).videoIdx

                	text = '[TestApp] videoIdx : ' + videoIdx;
	                log(text);

	                play(videoIdx); // play the video.
                }
                else if(JSON.parse(actionData).pictureIdx) { // in case Tile is picture.
                	pictureIdx = JSON.parse(actionData).pictureIdx

                	text = '[TestApp] pictureIdx : ' + pictureIdx;
	                log(text);

	                paint(pictureIdx); // paint the picture.
                }
            }
        }
    } else {
        log('no req app control');
    }
}

// for playing video
function play(value) {
	if(element && isPlay && !isPaint) {
		element.src = contentsURL + value + '.mp4';
		element.play();
	}
	else if(element && !isPlay && isPaint) {
		document.getElementsByTagName('body')[0].removeChild(element);
		isPaint = false;

		element = document.createElement('video');
		element.controls = true;
		element.className = 'video';

		element.src = contentsURL + value + '.mp4';
		document.getElementsByTagName('body')[0].appendChild(element);
		element.play();
		isPlay = true;
	}
	else if(!element) {
		element = document.createElement('video');
		element.controls = true;
		element.className = 'video';

		element.src = contentsURL + value + '.mp4';
		document.getElementsByTagName('body')[0].appendChild(element);
		element.play();
		isPlay = true;
	}
}

// for painting picture
function paint(value) {
	if(element && !isPlay && isPaint) {
		element.src = contentsURL + value + '.jpg';
	}
	else if(element && isPlay && !isPaint) {
		document.getElementsByTagName('body')[0].removeChild(element);
		isPlay = false;

		element = document.createElement('img');
		element.className = 'img';

		element.src = contentsURL + value + '.jpg';
		document.getElementsByTagName('body')[0].appendChild(element);
		isPaint = true;
	}
	else if(!element) {
		element = document.createElement('img');
		element.className = 'img';

		element.src = contentsURL + value + '.jpg';
		document.getElementsByTagName('body')[0].appendChild(element);
		isPaint = true;
	}
}

// onload main
function main() {
	log('[TestApp] onload');

	// launch service
	launchService(bgServiceId);

	// add appcontrol event with deepLink function
	window.addEventListener('appcontrol', deepLink);
	// call deepLink function for first load
	deepLink();

	document.addEventListener('visibilitychange', function() {
	    if(document.hidden){
	    	// App is hidden
	    	text = 'hidden';
			log(text);
	    } else {
	    	// App is shown
	    	text = 'visible';
			log(text);
	    }
	});

	// register 0,1,2,3,4,5 key
	tizen.tvinputdevice.registerKey('0');
	tizen.tvinputdevice.registerKey('1');
	tizen.tvinputdevice.registerKey('2');
	tizen.tvinputdevice.registerKey('3');
	tizen.tvinputdevice.registerKey('4');
	tizen.tvinputdevice.registerKey('5');
}

// handle keydown
function handleKeydown(event) {
	console.log('[TestApp] handleKeydown : ' + event.keyCode);

	switch(event.keyCode) {
		case 48:
			// key 0
			logClear();

		break;
		case 49:
			// key 1
			play(1);

		break;
		case 50:
			// key 2
			play(2);

		break;
		case 51:
			// key 3
			paint(3);

		break;
		case 52:
			// key 4
			paint(4);

		break;
		case 53:
			// key 5
			paint(5);

		break;
		case 10009:
			// key return
			console.log('[TestApp] return');

			if(element) {
				document.getElementsByTagName('body')[0].removeChild(element);
				element = '';
				isPlay = false;
				isPaint = false;
			} else {
				tizen.application.getCurrentApplication().exit();
			}

		break;
        default:

            break;
	}
}

// for debugging
function log(string) {
	result = result +' <br> ' + string;
	document.getElementById('result').innerHTML = result;
	console.log(string);
}

function logClear() {
	result = '';
	document.getElementById('result').innerHTML = '';
}
