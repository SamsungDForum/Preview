function handleKeydown(event) {
	console.log('[TestApp] handleKeydown : ' + event.keyCode);

	switch(event.keyCode) {
		case 10009:
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

var result = '';
var text = '';

var element = '';
var isPlay = false;
var isPaint = false;

var contentsURL = 'https://www.samsungdforum.com/Preview/';

function main() {
	log('[TestApp] onload');

	window.addEventListener('appcontrol', deepLink);
	deepLink();

	document.addEventListener("visibilitychange", function() {
	    if(document.hidden){
	    	text = 'hidden';
			log(text);
			
	    } else {
	    	text = 'visible';
			log(text);
	    }
	});
}

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
        log("no req app control");
    }
}

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

function log(string) {
	result = result +' <br> ' + string;
	document.getElementById('result').innerHTML = result;
}

function logClear() {
	result = '';
	document.getElementById('result').innerHTML = '';
}
