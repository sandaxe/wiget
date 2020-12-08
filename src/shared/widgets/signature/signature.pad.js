import React from 'react';
import PropTypes from 'prop-types';
import SignaturePad from 'signature_pad';

export default class SignatureCanvas extends React.Component {
  static propTypes = {
    // signature_pad's props
    velocityFilterWeight: PropTypes.number,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    minDistance: PropTypes.number,
    dotSize: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    penColor: PropTypes.string,
    throttle: PropTypes.number,
    onEnd: PropTypes.func,
    onBegin: PropTypes.func,
    // props specific to the React wrapper
    canvasProps: PropTypes.object,
    clearOnResize: PropTypes.bool
  }

  static defaultProps = {
    clearOnResize: true
  }


  componentDidMount() {
    this.sigPad = new SignaturePad(this.canvas, this.excludeOurProps());
    this.resizeCanvas();
    this.clear();
    this.on();
  }

  // propagate prop updates to SignaturePad
  componentDidUpdate() {
    Object.assign(this.sigPad, this.excludeOurProps());
  }

  componentWillUnmount() {
    this.off();
  }


  sigPad = null

  excludeOurProps = () => {
    let { canvasProps, clearOnResize, ...sigPadProps } = this.props;
    return sigPadProps;
  }

  // return the canvas ref for operations like toDataURL
  getCanvas = () => {
    return this.canvas;
  }

  // return the internal SignaturePad reference
  getSignaturePad = () => {
    return this.sigPad;
  }

  checkClearOnResize = () => {
    if (!this.props.clearOnResize) {
      return;
    }
    this.resizeCanvas();
  }

  resizeCanvas = () => {
    let canvasProps = this.props.canvasProps || {};
    let { width, height } = canvasProps;

    let canvas = this.canvas;
    /* When zoomed out to less than 100%, for some very strange reason,
      some browsers report devicePixelRatio as less than 1
      and only part of the canvas is cleared then. */
    let ratio = Math.max(window.devicePixelRatio || 1, 1);

    // only change width/height if none has been passed in as a prop
    if (!width) {
      canvas.width = canvas.offsetWidth * ratio;
    }
    if (!height) {
      canvas.height = canvas.offsetHeight * ratio;
    }
    if(!width || !height) {
      canvas.getContext('2d').scale(ratio, ratio);
    }
  }


  // all wrapper functions below render
  on = () => {
    window.addEventListener('resize', this.checkClearOnResize);
    return this.sigPad.on();
  }

  off = () => {
    window.removeEventListener('resize', this.checkClearOnResize);
    return this.sigPad.off();
  }

  clear = () => {
    return this.sigPad.clear();
  }

  isEmpty = () => {
    return this.sigPad.isEmpty();
  }

  fromDataURL = (dataURL, options) => {
    return this.sigPad.fromDataURL(dataURL, options);
  }

  toDataURL = (type, encoderOptions) => {
    return this.sigPad.toDataURL(type, encoderOptions);
  }

  fromData = (pointGroups) => {
    return this.sigPad.fromData(pointGroups);
  }

  toData = () => {
    return this.sigPad.toData();
  }

  render() {
    let { canvasProps } = this.props;
    return <canvas ref={(ref) => { this.canvas = ref; }} {...canvasProps} />;
  }
}
