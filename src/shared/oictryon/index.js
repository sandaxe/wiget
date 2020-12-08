import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { error }                            from './utils/utils__logging.js'

import { oicSetup, trackCamera }  from './3dcore.js'

import { SystemUtils }                      from './utils/utils__system.js'
// import { drawCircles }                      from './utils/utils__canvas.js'
import { drawFaceDetectionResults }         from './utils/utils__draw_tracking_results.js'

import { brfv5 }                            from './brfv5/brfv5__init.js'

import { configureNumFacesToTrack }         from './brfv5/brfv5__configure.js'
import { setROIsWholeImage }                from './brfv5/brfv5__configure.js'

// import { colorPrimary }                     from './utils/utils__colors.js'

import { render3DScene, setNumFaces }       from './threejs/threejs__setup.js'

import { load3DModel, load3DOcclusionModel }from './threejs/threejs__loading.js'
import { set3DModelByName }                 from './threejs/threejs__loading.js'

import { hide3DModels, updateByFace }       from './ui/ui__overlay__threejs.js'
let numFacesToTrack = 1
let glassName = "";
export const configureGlass = (brfv5Config) => {

  configureNumFacesToTrack(brfv5Config, numFacesToTrack)

  if(numFacesToTrack > 1) {

    setROIsWholeImage(brfv5Config)
  }

  setNumFaces(numFacesToTrack)

  brfv5Config.faceTrackingConfig.enableFreeRotation = false
  brfv5Config.faceTrackingConfig.maxRotationZReset  = 34.0

  load3DOcclusionModel('./assets/3d/occlusion_head_reference.json','./assets/3d/textures/', null).then(() => {

  }).catch((e) => {
    error('Could not load 3D occlusion model:', e)
  })
  console.log('glassNameglassName', glassName)
  load3DModel('./assets/3d/'+glassName,'./assets/3d/textures/', null).then(() => {

    set3DModelByName()
    render3DScene()

  }).catch((e) => {

    error('Could not load 3D model:', e)
  })
}

export const handleTrackingResults = (brfv5Manager, brfv5Config, canvas) => {
  const ctx   = canvas.getContext('2d')
  const faces = brfv5Manager.getFaces()
  let doDrawFaceDetection = false
  hide3DModels()
  for(let i = 0; i < faces.length; i++) {
    const face = faces[i];
    if(face.state === brfv5.BRFv5State.FACE_TRACKING) {
      // drawCircles(ctx, face.landmarks, colorPrimary, 2.0);
      updateByFace(ctx, face, i, true)
      if(window.selectedSetup === 'image') {
        updateByFace(ctx, face, i, true)
        updateByFace(ctx, face, i, true)
        updateByFace(ctx, face, i, true)
      }
    } else {
      updateByFace(ctx, face, i, false)
      doDrawFaceDetection = true;
    }
    render3DScene()
  }

  if(doDrawFaceDetection) {
    drawFaceDetectionResults(brfv5Manager, brfv5Config, canvas)
  }
  return false
}


export class OiCTryon extends Component {
  static propTypes = {
    glassName: PropTypes.string.isRequired,
    isFullscreen: PropTypes.bool,
    numFacesToTrack: PropTypes.number
  }

  static defaultProps = {
    isFullscreen: true,
    numFacesToTrack: 1
  }

  constructor(props) {
    super(props);
    this.oicConfig = {
      modelName:                SystemUtils.isMobileOS ? '42l_min' : '42l_max',
      enableDynamicPerformance: window.selectedSetup === 'camera',
      onConfigure:              configureGlass,
      onTracking:               handleTrackingResults
    }
  }

  

  componentDidMount(){
    this.run();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.glassName !== nextProps.glassName) {
       glassName = nextProps.glassName;
       this.loadGlass(glassName)
    }
  }

  loadGlass(glassName){
    load3DOcclusionModel('./assets/3d/occlusion_head_reference.json','./assets/3d/textures/', null).then(() => {
  
    }).catch((e) => {
      error('Could not load 3D occlusion model:', e)
    })
    console.log('glassNameglassName', glassName)
    load3DModel('./assets/3d/'+glassName,'./assets/3d/textures/', null).then(() => {
  
      set3DModelByName()
      render3DScene()
  
    }).catch((e) => {
  
      error('Could not load 3D model:', e)
    })
  }

  run(){
    glassName = this.props.glassName;
    numFacesToTrack = this.props.numFacesToTrack
    oicSetup(this.oicConfig)
    trackCamera()
  }

  render() {
    return (
      <div id="__brfv5" className="__brfv5"/>
    );
  }
}


export default { OiCTryon }
