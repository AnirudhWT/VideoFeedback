## Setup
1) `git clone` from https://github.com/AnirudhWT/videoAnalytics.git.
2) `npm install`
3) `react-native start` to start the server(node server)
4) `react-native run-android` to install the application in mobile device.

## Dependencies/Pre-requisites
### Android
1) `Android studio should be installed` (Tested android studio version is `3.6.1`)
2) `Java should be installed` (Tested java version is `1.8`)

## Development tips
1) `adb devices` to see the list of devices which are connected to the system. (Note: `adb drivers` should be installed, if not available)
2) Enable USB debugging mode in the developer options of the mobile devices, which allows to manage the mobile device through `adb` to `install apk`, `hot reload apk` and ... (Note: You have to make the developer options enable, to enable this one go to `settings --> about --> build number (click on three times)`)
3) switch to node server terminal, then `press r`, to do hot reload(if required)
4) If you want to work with virtual device (emulator, when you don't have mobile device), open the android studio and then AVD manager and select the virtual device you want to start.
### Debugging
1) launch http://localhost:8081/debugger-ui/ in the browser(chrome)
2) switch to node server terminal, then `press d`, you can start debugging your app as normal javascript application.

### Small brief

1. First step is to use react-native-video to play video.
2. In order to give a feedback on currently running feedback.
    a) stop video where user feels to add Feedback . 
       Tap on the top of video where Add feedback is flashing and writing feedback pas per requirement.
       When user add feedback it gets saved in state with timestamp like {starttime:HH:MM:SS:microsec,endtime:HH:MM:SS:microsec,text:""}.
    b) To suggest more imporvisation to mention things on the video with an overlaying styling using sketch canvas.
        (@terrylinla/react-native-sketch-canvas is library for canvas).Canvas is always there overlaying the screen.
        Stop video and draw at specific places on canvas so that correction in video can be made easy to understad.
        When user add feedback by drawing on the canvas.There is  a save button adjacent to play and pause button when helps in saving canvas as a photoand also it gets saved in state with timestamp like {starttime:HH:MM:SS:microsec,endtime:HH:MM:SS:microsec,path:""}.

### Future scope
At the end of the video we can save all the text feedback added by user in .SRT file in order to show it like subtitles where mistake was.
react-native-screen-recorder ibrary is also there to capture the whole session of checking the video .