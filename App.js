
import React, { Component } from 'react';
import {
  Keyboard,
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Picker,
  TextInput,
  ToastAndroid,
  ProgressBarAndroid,
  TouchableOpacity
} from 'react-native';
import Video from 'react-native-video';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScreenRecorderManager from 'react-native-screen-recorder';
import KeyboardListener from 'react-native-keyboard-listener';

export default class App extends Component {
  KeyboardStatus=false;
  constructor(props) {
    super(props);

    // init state variables
    this.state = {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,
      paused: true,
      pickerValueHolder: '1.0',
      pausedText: 'play',
      hideControls: false,
      subtitles:[],
      feedbackstart:false,
      feedbacktext:"",
      canvasFeedback:[],
      KeyboardStatus:false
    };
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.video = Video;
  }
  
  _keyboardDidShow () {
   
      this.KeyboardStatus= true;
  
  };

  _keyboardDidHide () {
    this.KeyboardStatus= false;
  };
 

  
  // load video event
  onLoad = (data) => {
    this.setState({ duration: data.duration });
  };

  // video is playing
  onProgress = (data) => {
    this.setState({ currentTime: data.currentTime },()=>{console.log(parseInt(1000*(this.state.currentTime-Math.floor(this.state.currentTime))))});
  };

  // video ends
  onEnd = () => {
    this.setState({ paused: true, pausedText: 'play'})
  };

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    }
    return 0;
  };

  onChangeRate(itemValue, itemIndex) {
    var rate = parseFloat(itemValue);
    this.setState({pickerValueHolder: itemValue, rate: rate});
  }

  // pressing on 'play' button
  onPressBtnPlay() {
    var pausedText = "pause";
    if(!this.state.paused){
      pausedText = 'play';

      // always show controls
      if(this.timeoutHandle)
        clearTimeout(this.timeoutHandle);
    }
    else {
      pausedText = 'pause';

      // hide controls after 5s
      this.timeoutHandle = setTimeout(()=>{
        this.setState({hideControls: true});
      }, 5000);
    }
    this.setState({ paused: !this.state.paused, pausedText: pausedText });
  }

  // on press video event
  onPressVideo() {
    // showing controls if they don't show
    if(this.state.hideControls){
      this.setState({hideControls: false});
      this.timeoutHandle = setTimeout(()=>{
        this.setState({hideControls: true});
      }, 8000);
    }
  }

  // parse seconds to time (hour:minute:second)
  parseSecToTime(sec) {
    var sec_num = parseInt(sec, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0" + hours;}
    if (minutes < 10) {minutes = "0" + minutes;}
    if (seconds < 10) {seconds = "0" + seconds;}

    return hours + ':' + minutes + ':' + seconds;
  }
  saveFeedback=()=>{
    console.log("saving");
    let rawdata=[...this.state.subtitles];
    let hour=parseInt(parseInt(this.state.currentTime/60)/60);
    let minute=parseInt(this.state.currentTime/60);
    let seconds=parseInt(this.state.currentTime);
    let micseconds=parseInt(1000*(this.state.currentTime-Math.floor(this.state.currentTime)));
    rawdata.push({"starttime":`${hour}:${minute}:${seconds}:000`,"endtime":`${hour}:${minute}:${seconds+1}:000`,"text":this.state.feedbacktext})
    this.setState({subtitles:rawdata,feedbackstart:false},()=>{console.log(this.state.subtitles)})
  }

  saveCanvasFile=()=>{  
        let date = new Date();
        this._sketchCanvas.save('png', true, '/Videoanalytics', 
        'sample'+parseInt(Math.random()*1000),
        true, true, false);
        this._sketchCanvas.clear()
  }

  saveCanvasFeedback=(path)=>{
    Alert.alert(`Saved to  ${path}`);

    let hour=parseInt(parseInt(this.state.currentTime/60)/60);
    let minute=parseInt(this.state.currentTime/60);
    let seconds=parseInt(this.state.currentTime);
    let micseconds=parseInt(1000*(this.state.currentTime-Math.floor(this.state.currentTime)));
        let rawData=[...this.state.canvasFeedback];
        rawData.push({"starttime":`${hour}:${minute}:${seconds}:000`,"endtime":`${hour}:${minute}:${seconds+1}:000`,"path":path})
        this.setState({canvasFeedback:rawData},()=>{console.log(this.state)})
  }


  render() {
    console.log(this.KeyboardStatus)
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    return (<React.Fragment>
      <View style={styles.container}>
      <View style={styles.fullScreen}>
         <TouchableWithoutFeedback
          
          onPress={() => this.onPressVideo()}>
          <Video
  
            /* For ExoPlayer */
            source={{ uri: 'https://rawgit.com/uit2712/Mp3Container/master/tom_and_jerry_31.mp4' }} 
            
            style={styles.fullScreen}
            rate={this.state.rate}
            paused={this.state.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            onLoad={this.onLoad}
            onProgress={this.onProgress}
            onEnd={this.onEnd}
            onAudioBecomingNoisy={this.onAudioBecomingNoisy}
            onAudioFocusChanged={this.onAudioFocusChanged}
            repeat={false}
          />
        </TouchableWithoutFeedback>
        <View style={{borderWidth:2,position:"absolute",left:0,top:this.state.KeyboardStatus?20:170,width:410,height:200,zIndex:22}}>
        <View style={{justifyContent:"center",alignItems:"center"}}>
       {!this.state.feedbackstart?<TouchableOpacity onPress={()=>{
         this.setState({feedbackstart:true})
        }}><Text>Add feedback</Text></TouchableOpacity>:
       <TextInput 
       placeholder="Feedback" 
       style={{padding:0,backgroundColor:"transparent",color:"white"}} 
       onChangeText={(text)=>{this.setState({feedbacktext:text})}} 
       onSubmitEditing={()=>this.saveFeedback()}/>}
        </View>
        <View style={{alignItems:"flex-end"}}>
        <View style={{borderWidth:1,borderColor:"Red"}}>
        <SketchCanvas
            ref={ref => this._sketchCanvas = ref}
            style={{width:200,height:170,zIndex:22}}
            strokeColor={'red'}
            strokeWidth={5}
            onSketchSaved={(success,path)=>{
               success && this.saveCanvasFeedback(path);
            }}
          />
        </View>
        </View>

        </View>
      </View>
        {
          !this.state.hideControls ?
          (
            <View style={styles.controls}>
              <View style={styles.generalControls}>
                <View style={styles.rateControl}>
                  <Picker
                    style={{width: 110}}
                    selectedValue={this.state.pickerValueHolder}
                    onValueChange={(itemValue, itemIndex) => this.onChangeRate(itemValue, itemIndex)} >
                    <Picker.Item label="x1.5" value="1.5"/>
                    <Picker.Item label="x1.25" value="1.25"/>
                    <Picker.Item label="x1.0" value="1.0"/>
                    <Picker.Item label="x0.75" value="0.75"/>
                    <Picker.Item label="x0.5" value="0.5"/>
                  </Picker>
                </View>
                <View style={styles.playControl}>
                  <TouchableOpacity onPress={() => this.onPressBtnPlay()}><Icon name={this.state.pausedText}/></TouchableOpacity>
                  <View><TouchableOpacity onPress={this.saveCanvasFile} style={{backgroundColor:"darkgreen",paddingRight:10,paddingLeft:10}} ><Text style={{color:"white"}}>save</Text></TouchableOpacity></View>
                </View>
                <View style={styles.resizeModeControl}>
                  <Picker
                    style={{width: 150}}
                    selectedValue={this.state.resizeMode}
                    onValueChange={(itemValue, itemIndex) => this.setState({resizeMode: itemValue})} >
                    <Picker.Item label="none" value="none"/>
                    <Picker.Item label="cover" value="cover"/>
                    <Picker.Item label="stretch" value="stretch"/>
                    <Picker.Item label="contain" value="contain"/>
                  </Picker>
                </View>
              </View>

              <View style={styles.trackingControls}>
                <ProgressBarAndroid
                  style={styles.progress}
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={this.getCurrentTimePercentage()}
                />
                <Text>{this.parseSecToTime(parseInt(this.state.currentTime))}/{this.parseSecToTime(parseInt(this.state.duration))}</Text>
              </View>
            </View>
          ) : (null)
        }
        

        
      </View>
      <View style={{backgroundColor:"lightgreen",flexDirection:"row",justifyContent:"space-around"}}>
      <TouchableOpacity style={{backgroundColor:"darkgreen",paddingRight:10,paddingLeft:10}} onPress={()=>{ScreenRecorderManager.start()}}><Text style={{color:"white"}} >Start Recording</Text></TouchableOpacity>
      <TouchableOpacity style={{backgroundColor:"darkgreen",paddingRight:10,paddingLeft:10}} onPress={()=>{ScreenRecorderManager.stop()}}><Text style={{color:"white"}}  >Stop Recording</Text></TouchableOpacity>

    </View>
    
    </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgreen',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  playButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  controls: {
    backgroundColor: 'white',
    opacity: 0.7,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});