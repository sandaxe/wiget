import React, { Component } from 'react';
import $ from "jquery";
import styles from "./capture.css";
import "./js/tracking.min";
import "./js/face.min";
export class Capturecomponent extends Component{
  componentDidMount(){
    if (!navigator.mediaDevices) {
      alert('getUserMedia support required to use this page');
    }
    var video=document.getElementById('video');
    var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
window.navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
        video.play();
    };
})
.catch( () => {
    alert('You have give browser the permission to run Webcam and mic ;( ');
});
      document.querySelector('#obtn').addEventListener('click', () => {
        context.drawImage(video,130,0,360,480,0,0,360,480);
        var dataURL = canvas.toDataURL();
        localStorage.setItem("capturedimage",dataURL);
        window.location="/view/main/tryon";
    });
  }
    render(){
        return(
            <div className={styles.wrap}>
    <div className={styles.demo} id="demo">
      <div className={styles.imgframe} id="imgframe">
      </div>
      <span id="obtn" className={styles.btn}>
          <img className={styles.rimg} src={require("./img/widget/camera_white.png" )}/>
        </span>
              <div className={styles.cardtitle} styles="margin-bottom:15px;">
                <strong>POSITION YOUR FACE INSIDE THE CAMERA</strong>
              </div>
              <div>
              
              <div>
        </div>
        </div>
        <span className={styles.power}>Powered by
          <img className={styles.foobrand} src={require("./img/widget/oic_footer.png")} />
        </span>
        <video id="video"  width="360" height="480" autoplay loop muted style={{display:"block",position:"absolute",objectFit:"cover"}}></video> 
        <canvas id="canvas" class="canvas" width="360" height="480" style={{visibility:"hidden"}}> </canvas>
        
    </div>
    
  </div>
        );
    }
}
export default Capturecomponent;