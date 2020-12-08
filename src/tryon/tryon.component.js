import React, { Component } from 'react';
import styles from "./tryon.css";
import $ from "jquery";
const axios = require('axios');
//const {Storage} = require('@google-cloud/storage');
//import * as storage from "@google-cloud/storage";
//import getimageDataFromVision from "./imgUploadGCS";

//import * as faceapi from 'face-api.js';
//import s3 from "./imagecomponent";
var deter="";
    var data = localStorage.getItem("capturedimage");
    let currentModelInView = 0;
    let imageData = {};
    let imageSource = '';
    let $previewFrame=document.querySelector('#oicframe');
    const pass=require("./credentails.json");
    imageSource = '/public/img/widget/profile.jpg';
    imageData = {
        _id: 'DEFAULT',
        sellionPointsWidth: 186.6,
        sellionPointsHeight: 215.5,
        distance: 136.19,
        YPR: '0_3_0',
        deviationYaw: 0,
        deviationPitch: 0,
        deviationRoll: 0
    };

class Tryon extends Component{

    componentDidMount(){
        let API= 'AIzaSyBPzh4MX7zS8pV1hKnbARYGwgKtl3T4Yhk';
        this.init();
    }

init(){

    if(localStorage.getItem("capturedimage")!=null) {
        $('#profile-image').attr('src', data);
     }
    let $userRefSelectModelModal = document.querySelector('#oic-select-model-modal');
    document.querySelector('#select-model-btn').addEventListener('click', () => {
        $('#oicframe').attr('src', '');
        deter=require("./img/widget/profile.jpg");
        document.getElementById("profile-image").style.filter="blur(8px)";
        $userRefSelectModelModal.style.display = '';
            $userRefSelectModelModal.style.display = 'block';
    });
    document.querySelector('#prev').addEventListener('click', () => {
        currentModelInView = 0;
        const img=require("./img/widget/profile.jpg");
        deter=require("./img/widget/profile.jpg");
        $('#profilecontainer').attr('src',img);
    });
    document.querySelector('#next').addEventListener('click', () => {
        currentModelInView = 1;
        const imgs=require("./img/widget/female.jpg");
        deter=require("./img/widget/female.jpg");
        $('#profilecontainer').attr('src', imgs);
    });
    document.getElementById("widget-upload").onchange=function(){
       localStorage.removeItem("capturedimage");
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#profile-image').attr('src', e.target.result);
            }
            reader.readAsDataURL(this.files[0]);
        }
        document.getElementById('oic-upload-modals').style.display="none";
        document.getElementById("profile-image").style.filter="blur(0px)";
    }
    document.querySelector('#upload-image-btn').addEventListener('click', () => {
        document.getElementById("profile-image").style.filter="blur(8px)";
        $("#oicframe").attr('src', '');
        document.getElementById('oic-upload-modals').style.display="block";
    });
        document.querySelector('#oicmodal__close').addEventListener('click', () => {
            document.getElementById('oic-select-model-modal').style.display="none";
            document.getElementById('oic-upload-modals').style.display="none";
            document.getElementById("profile-image").style.filter="blur(0px)";
        });
        document.querySelector('#oicmodel__close').addEventListener('click', () => {
            document.getElementById('oic-select-model-modal').style.display="none";
            document.getElementById('oic-upload-modals').style.display="none";
            document.getElementById("profile-image").style.filter="blur(0px)";
        });
        document.querySelector('#oic-submit-image').addEventListener('click', () => {
            document.getElementById('oic-select-model-modal').style.display="none";
            localStorage.removeItem("capturedimage");
            if (currentModelInView === 0) {
                // Male Model
                imageSource = '/public/img/widget/profile.jpg';
                imageData = {
                    _id: 'DEFAULT',
                    sellionPointsWidth: 186.6,
                    sellionPointsHeight: 215.5,
                    distance: 136.19,
                    YPR: '0_3_0',
                    deviationYaw: 0,
                    deviationPitch: 0,
                    deviationRoll: 0
                };
            } else {
                // Female Model
                imageSource = '/public/img/widget/female.jpg';
                imageData = {
                    _id: 'DEFAULT',
                    sellionPointsWidth: 183.71,
                    sellionPointsHeight: 201.08,
                    distance: 136.19,
                    YPR: '0_3_0',
                    deviationYaw: 0,
                    deviationPitch: 0,
                    deviationRoll: 0
                };
            }
            $('#profile-image').attr('src', deter);
            document.getElementById("profile-image").style.filter="blur(0px)";
        });

}
    getFrames=(frameId)=>{
        const resultType = {};
		const resultType2 = {};
    const request = new XMLHttpRequest();
    request.open('POST',"https://65.0.98.132/widget/getGlassFrames",true);
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        console.log("changed");
      } else {
        console.log("notchanged");
      }
    };
		let left = 0;
		let top = 0;
		let width = 0;
		let height = 0;
        let eyeFrameScaleFactor = 1.6;
        let searchParams="";
        let framedet=`https://s3-ap-southeast-1.amazonaws.com/offline-rendering/preRendered/${frameId}/Images/0_3_0.png`;
        var frameIdArray = [];
            frameIdArray.push(frameId);
            let url = `https://s3-ap-southeast-1.amazonaws.com/offline-rendering/preRendered/${frameId}/jsons/${imageData.YPR}.json`;
      axios.get(url)
         .then(response => {
                const dataFrame = response.data;
                searchParams = frameId + '/Images/' + imageData.YPR + '.png';
                resultType.width = dataFrame.dimension[1];
				resultType.height = dataFrame.dimension[0];
				resultType2.width = dataFrame.dimension_0[1];
				resultType2.height = dataFrame.dimension_0[0];
				left =
					parseInt(imageData.sellionPointsWidth) -
					dataFrame[searchParams][0] * (imageData.distance * eyeFrameScaleFactor / resultType2.width);
				top =
					parseInt(imageData.sellionPointsHeight) -
					dataFrame[searchParams][1] * (imageData.distance * eyeFrameScaleFactor / resultType2.width);
				width = resultType.width * (imageData.distance * eyeFrameScaleFactor / resultType2.width);
                height = resultType.height * (imageData.distance * eyeFrameScaleFactor / resultType2.width);
                left=parseInt(left);
                document.getElementById("oicframe").style.left = `${left}px`;
                document.getElementById("oicframe").style.top = `${top}px`;
                document.getElementById("oicframe").style.width = `${width}px`;
                document.getElementById("oicframe").style.transform = `perspective(200px) rotateX(${imageData.deviationX}deg) rotateY(${
           imageData.deviationY
       }deg) rotateZ(${imageData.deviationZ}deg)`;
       });
       document.getElementById("oicframe").setAttribute('src',framedet);


    }



    render(){
        return(
            <div className={styles.tryoncont}>
                <nav>
        <ul className={styles.brand}>
            <li style={{marginLeft:"2%",marginTop:"0%"}} >
                <a href="#">
                    <img src={require("./img/fav.png")} width="100"/>
                </a>
            </li>


        </ul>
    </nav>
    <div className={styles.page}>
        <div className={styles.glasses}>
            <div className={styles.widgetorder}>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005243/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>
                </li>
                <button onClick={()=>this.getFrames('lookz_00005243')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005244/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>
                </li>
                <button onClick={()=>this.getFrames('lookz_00005244')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005245/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>
                </li>
                <button onClick={()=>this.getFrames('lookz_00005245')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005246/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>
                </li>
                <button onClick={()=>this.getFrames('lookz_00005246')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005247/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>

                </li>
                <button onClick={()=>this.getFrames('lookz_00005247')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005248/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>

                </li>
                <button onClick={()=>this.getFrames('lookz_00005248')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005249/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>

                </li>
                <button onClick={()=>this.getFrames('lookz_00005249')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005250/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>

                </li>
                <button onClick={()=>this.getFrames('lookz_00005250')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005251/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>

                </li>
                <button onClick={()=>this.getFrames('lookz_00005251')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005252/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>

                </li>
                <button onClick={()=>this.getFrames('lookz_00005252')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00005253/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>

                </li>
                <button onClick={()=>this.getFrames('lookz_00005253')}>TRY NOW</button>
                </div>
                <div className={styles.widh}>
                <li>
                    <img src="https://s3-ap-south-1.amazonaws.com/2d-visual/lookz_00004049/thumbnail.jpg"/>
                    <p className={styles.prodname}>MARC - MB102</p>
                    <p>GOLDEN RIM AVIATOR</p>

                </li>
                <button onClick={()=>this.getFrames('lookz_00004049')}>TRY NOW</button>
                </div>
            </div>
            <canvas id="canvas"></canvas>
        </div>

        <div id="widgetcode">

            <div id="oic-main-wrap">
                <main className={styles.oiccontent} id="oic-content">

                    <div className={styles.oicinwrap}>

                        <div className={styles.tryoutarea}>

                            <div className={styles.tryoutoption}>
                                <nav className={styles.optionnav}>
                                    <ul className={styles.omenu}>
                                        <li className={styles.omenu__item}>
                                            <a href="/view/main/capture" className={styles.oichook}>
                                                <img className={styles.resimg} src={require("./img/widget/camera.png")} />
                                            </a>
                                        </li>
                                        <li className={styles.omenu__item}>
                                            <a className={styles.oichook} id="upload-image-btn">
                                                <img className={styles.resimg} src={require("./img/widget/upload.png")} />
                                            </a>
                                        </li>

                                        <li className={styles.omenu__item}>
                                            <a className={styles.oichook} id="select-model-btn">
                                                <img className={styles.resimg} src={require("./img/widget/preset.png")}/>
                                            </a>
                                        </li>

                                        <div className={styles.productmatch}>
                                            <ul className="oic-vlist">
                                                <li className={styles.oicitem}>
                                                    <a className={styles.producthook}>
                                                        <img className={styles.resimg} />
                                                    </a>
                                                </li>
                                                <li className={styles.oicitem}>
                                                    <a className={styles.producthook}>
                                                        <img className={styles.resimg} />
                                                    </a>
                                                </li>
                                                <li className={styles.oicitem}>
                                                    <a className={styles.producthook}>
                                                        <img className={styles.resimg} />
                                                    </a>
                                                </li>
                                                <li className={styles.oicitem}>
                                                    <a className={styles.producthook}>
                                                        <img className={styles.resimg} />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </ul>
                                </nav>
                            </div>
                            <figure className={styles.oicuser__profile}>
                                <div id="oic-preloader"></div>

                                <img className={styles.resimg} id="profile-image" src={require("./img/widget/profile.jpg")} style={{width:"360px"}} />
                                <img id="oicframe" className={styles.oicframe} />
                            </figure>
                            <footer className={styles.oicfooter} id="oic-footer">
                                <div className={styles.oicfooter__inwrap}>
                                    <span>Powered by
                                        <img className={styles.oicfooter__brand} src={require("./img/widget/oic_footer.png")} />
                                    </span>
                                </div>
                            </footer>

                            <div className={styles.oicmodals} id="oic-upload-modals" style={{display:"none"}}>
                                <div className={styles.oicmodal__body}>
                                    <div className={styles.oiccard}>
                                        <div className={styles.oiccard__body}>

                                                <div className={styles.oiccard__title}>
                                                    <strong>
                                                        click to select image
                                                        <br/>(or)
                                                        <br/>drag and drop</strong>
                                                </div>
                                                <input type="file" id="widget-upload" style={{opacity: "0.0",height:"10px"}}/>
                                        </div>

                                    </div>
                                    <button className={styles.oicmodel__close} id="oicmodel__close">
                                        <img src={require("./img/widget/close.png" )}/>
                                    </button>
                                </div>
                            </div>
                            <div className={styles.oicmodal} >
                                <div className={styles.oicmodal__body} id="oic-select-model-modal" style={{display:"none"}}>
                                    <div className={styles.oiccard}>
                                        <div className={styles.oiccard__body}>
                                            <div className={styles.oiccard__title}>
                                                <strong>Choose a model</strong>
                                            </div>
                                            <figure className={styles.oicmodel__figure}>
                                                <img id="profilecontainer" className={styles.resimg} src={require("./img/widget/profile.jpg" )}/>
                                            </figure>
                                            <nav className={styles.oicnav}>
                                                <a className={styles.oicnav__prev} id="prev">
                                                    <img src={require("./img/widget/left_arrow.png" )}/>
                                                </a>
                                                <a className={styles.oicnav__next} id="next">
                                                    <img src={require("./img/widget/right_arrow.png" )}/>
                                                </a>
                                            </nav>
                                            <div className={styles.oichlist}>
                                                <div className={styles.oicitem}>
                                                    <button id="oic-submit-image" className={styles.oicbtn}>Select</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button className={styles.oicmodal__close} id="oicmodal__close">
                                        <img src={require("./img/widget/close.png" )}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>

        </div>

    );}
}

export default Tryon;
