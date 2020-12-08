import { log, error }                                                       from './utils/utils__logging.js'
import { SystemUtils }                                                      from './utils/utils__system.js'
import { ScaleMode }                                                        from './utils/utils__resize.js'
import { getURLParameter }                                                  from './utils/utils__get_params.js'

import { drawFaceTrackingResultsDefault }                                   from './utils/utils__draw_tracking_results.js'
import { drawInput, drawInputMirrored }                                     from './utils/utils__canvas.js'

import { loadBRFv5Model }                                                   from './brfv5/brfv5__init.js'

import { configureCameraInput, configureImageInput }                        from './brfv5/brfv5__configure.js'
import { configureNumFacesToTrack, configureFaceTracking }                  from './brfv5/brfv5__configure.js'
import { setROIsWholeImage }                                                from './brfv5/brfv5__configure.js'

import { enableDynamicPerformance, disableDynamicPerformance, averageTime } from './brfv5/brfv5__dynamic_performance.js'
import { onEnterFrame, onExitFrame }                                        from './brfv5/brfv5__dynamic_performance.js'

import { mountStage }                                                       from './ui/ui__stage.js'

import { mountImage,  loadImage,  setSizeImage,  getDataFromImage }         from './ui/ui__input__image.js'
import { closeImage }                                                       from './ui/ui__input__image.js'
import { mountCamera, openCamera, setSizeCamera, getDataFromCamera }        from './ui/ui__input__camera.js'
import { closeCamera }                                                      from './ui/ui__input__camera.js'

import { startTracking, stopTracking }                                      from './ui/ui__input__data.js'

import { mountPNGOverlay,      setSizePNGOverlay,      hidePNGOverlay }     from './ui/ui__overlay__png.js'
import { mountTextureOverlay,  setSizeTextureOverlay,  hideTextureOverlay } from './ui/ui__overlay__texture.js'
import { mountThreejsOverlay,  setSizeThreejsOverlay,  hideThreejsOverlay } from './ui/ui__overlay__threejs.js'
import { mountTextureExporter, setSizeTextureExporter, hideTextureExporter} from './ui/ui__exporter__texture.js'

import { mountPreloader, onProgress }                                       from './ui/ui__optional__preloader.js'
import { mountStats, updateStats }                                          from './ui/ui__optional__stats.js'
// import { mountLogo }                                                        from './ui/ui__optional__logo.js'
import { mountFullscreen, setFullscreenState }                              from './ui/ui__optional__fullscreen.js'

const _name                     = 'BRFv5Example'
const _modelType                = getURLParameter(window.location.search, 'type') === '42l' ? '42l' : '68l'
let _modelName                  = SystemUtils.isMobileOS ? _modelType + '_min' : _modelType + '_max'
let _brfv5Manager               = null
let _brfv5Config                = null
let _width                      = 0
let _height                     = 0
let _numFacesToTrack            = 1
let _numTrackingPasses          = 3
let _enableDynamicPerformance   = SystemUtils.isMobileOS
let _onConfigure                = null
let _onTracking                 = null
let _isImageTracking            = false

let _scaleMode                  = ScaleMode.PROPORTIONAL_INSIDE

export const oicSetup = (config = null) => {
  stopTracking()
  _width                        = 0
  _height                       = 0
  _numFacesToTrack              = 1
  _numTrackingPasses            = 3
  _enableDynamicPerformance     = SystemUtils.isMobileOS
  _onConfigure                  = null
  _onTracking                   = null
  if(config) { setExampleConfigValues(config) }
  log(_name + ': oicSetup')
  const __brfv5__stage = document.getElementById('__brfv5__stage')
  if(__brfv5__stage) {
    log(_name + ': oicSetup: already set up')
    hidePNGOverlay()
    hideTextureOverlay()
    hideTextureExporter()
    hideThreejsOverlay()
    return
  }
  const container = document.getElementById('__brfv5')
  if(!container) {
    error('DIV with id __brfv5 is missing.')
    return
  }

  const stage = mountStage(container)

  mountCamera(stage, _scaleMode)
  mountImage(stage, _scaleMode)

  mountTextureOverlay(stage, _scaleMode)
  mountTextureExporter(container)

  mountPNGOverlay(stage, _scaleMode)
  mountThreejsOverlay(stage, _scaleMode)

  mountPreloader(stage)
  mountStats(stage)
  // mountLogo(stage)
  // mountFullscreen(stage)
  
  loadBRFv5Model(_modelName, './models/', null, onProgress)
    .then(({ brfv5Manager, brfv5Config }) => {

      log(_name + ': loadBRFv5Model: done')

      _brfv5Manager  = brfv5Manager
      _brfv5Config   = brfv5Config

      initTracking()

    }).catch((e) => { 
      error('BRFV5_FAILED: WebAssembly supported: ', SystemUtils.isWebAssemblySupported, e) 
    })
}

export const setExampleConfigValues = (config) => {

  log(_name + ': setExampleConfigValues: config:', config)

  _onConfigure = config.onConfigure
  _onTracking  = config.onTracking

  const modelType = getURLParameter(window.location.search, 'type')

  if(!modelType && config.modelName)  { _modelName                = config.modelName }
  if(config.numFacesToTrack >= 0)     { _numFacesToTrack          = config.numFacesToTrack }
  if(config.enableDynamicPerformance) { _enableDynamicPerformance = config.enableDynamicPerformance }
  if(config.numTrackingPasses)        { _numTrackingPasses        = config.numTrackingPasses }
}

export const trackCamera = () => {

  _isImageTracking = false

  closeImage()

  openCamera()
    .then(({ width, height }) => setSizeAndInitTracking(width, height))
    .catch((e) => { if(e) { error('CAMERA_FAILED: ', e) } })
}

export const trackImage = (path) => {

  _isImageTracking = true

  closeCamera()

  loadImage(path)
    .then(({ width, height }) => setSizeAndInitTracking(width, height, true))
    .catch((e) => { if(e) { error('IMAGE_FAILED: ', e.msg) } })
}

const setSizeAndInitTracking = (width, height) => {

  log(_name + ': setSizeAndInitTracking: ' + width + 'x' + height)

  _width  = width
  _height = height

  setSizeCamera(_width, _height)
  setSizeImage(_width, _height)

  setSizeTextureOverlay(_width, _height)

  setSizeTextureExporter(_width, _height)
  setSizePNGOverlay(_width, _height)
  setSizeThreejsOverlay(_width, _height)

  setFullscreenState()

  initTracking()
}

const initTracking = () => {

  log(_name + ': initTracking: ' + (_brfv5Config !== null && _width > 0),
    'config:', _brfv5Config,
    'width:' , _width,
    'isImageTracking:', _isImageTracking
  )

  if(_brfv5Config !== null && _width > 0) {

    const _ifImageTrackingTrackOnlyOnce = true
    if(_isImageTracking) {

      if(_ifImageTrackingTrackOnlyOnce) {

        configureImageInput(_brfv5Config, _width, _height)

      } else {

        configureCameraInput(_brfv5Config, _width, _height)
        setROIsWholeImage(_brfv5Config)
      }
    } else {

      configureCameraInput(_brfv5Config, _width, _height)
    }
    configureFaceTracking(_brfv5Config, _numTrackingPasses, true)
    configureNumFacesToTrack(_brfv5Config, _numFacesToTrack)

    _brfv5Manager.reset()

    if(_onConfigure) { _onConfigure(_brfv5Config) }

    if(_enableDynamicPerformance) {
      enableDynamicPerformance(_brfv5Manager, _brfv5Config)

    } else {

      disableDynamicPerformance()
    }

    _brfv5Manager.configure(_brfv5Config)

    if(_isImageTracking) {

      const { input, canvas0, canvas1 } = getDataFromImage()
      setTimeout(() => {

        startTracking(input, canvas0, canvas1, drawInput, _ifImageTrackingTrackOnlyOnce,
          onImageDataUpdate, onEnterFrame, onExitFrame)

      }, 500) 

    } else {

      const { input, canvas0, canvas1 } = getDataFromCamera()
      startTracking(input, canvas0, canvas1, drawInputMirrored, false,
        onImageDataUpdate, onEnterFrame, onExitFrame)
    }
  }
}

const onImageDataUpdate = (imageData, activeCanvas, inactiveCanvas, trackOnlyOnce ) => {

  if(!_brfv5Manager || !imageData || !activeCanvas) { return }

  const numUpdates = !trackOnlyOnce ? 1 : _brfv5Config.faceTrackingConfig.numFacesToTrack * 2

  for(let i = 0; i < numUpdates; i++) {

    _brfv5Manager.update(imageData)
  }

  let drawDebug = false

  if(_onTracking) {

    drawDebug = _onTracking(_brfv5Manager, _brfv5Config, activeCanvas)

  } else {

    drawDebug = true
  }

  if(drawDebug) {

    drawFaceTrackingResultsDefault(_brfv5Manager, _brfv5Config, activeCanvas)
  }

  if(_brfv5Config.enableFaceTracking) {

    updateStats(averageTime.time, 'numTrackingPasses: '+_brfv5Config.faceTrackingConfig.numTrackingPasses +
      '<br />enableFreeRotation: '+ ( _brfv5Config.faceTrackingConfig.enableFreeRotation ? 1 : 0 ))

  } else {

    updateStats(averageTime.time, '')
  }

}

export default {
  oicSetup,
  setExampleConfigValues,
  trackImage,
  trackCamera
}
