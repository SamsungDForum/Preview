# Preview Sample Application
It is a sample application with Preview.

## Supported platforms
* Samsung Tizen TV 2016 models
* Samsung Tizen TV SDK 2.3.1 version

## How to show preview
Please follow [this guide](www.samsungdforum.com/~~~)

## In JSON
Please check [this sample JSON](www.samsungdforum.com/Preview/sampleJSON.json)

## In config.xml
Please check following things
```
<tizen:metadata key="http://samsung.com/tv/metadata/use.preview" value="endpoint_URL=https://www.samsungdforum.com/Preview/sampleJSON.json"/>
```
```
<tizen:app-control>
<tizen:src name="index.html" reload="disable"/>
<tizen:operation name="http://samsung.com/appcontrol/operation/eden_resume"/>
</tizen:app-control>
```
```
<tizen:application ... required_version='2.3'/>
<tizen:metadata key='http://samsung.com/tv/metadata/devel.api.version' value='2.4'/>
```

## In JS
```js
function deepLink() {
    var requestedAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
    var appControlData;
    var actionData;

    var videoIdx;
    var pictureIdx;

    if (requestedAppControl) {
        appControlData = requestedAppControl.appControl.data;
        
        for (var i = 0; i < appControlData.length; i++) {
            if (appControlData[i].key == 'PAYLOAD') {
                actionData = JSON.parse(appControlData[i].value[0]).values;

                if(JSON.parse(actionData).videoIdx) {
                    videoIdx = JSON.parse(actionData).videoIdx

                    console.log(videoIdx);
                }
                else if(JSON.parse(actionData).pictureIdx) {
                    pictureIdx = JSON.parse(actionData).pictureIdx

                    console.log(pictureIdx);
                }
            }
        }
    } else {
        console.log("no req app control");
    }
}
```
```
window.addEventListener('appcontrol', deepLink);
```

## SDF guide
[SDF Guide](www.samsungdforum.com/~~~)
