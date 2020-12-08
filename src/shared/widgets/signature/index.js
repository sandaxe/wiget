import React from 'react';
import PropTypes from 'prop-types';
import SignatureCanvas from './signature.pad';
import styles from './signature.css';

class Signature extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    className: PropTypes.string,
    penColor: PropTypes.string,
    readOnly: PropTypes.bool,
    clear: PropTypes.func,
    handleOnEnd: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number
  }

  constructor(props) {
    super(props);
    this.sigPad = null;
  }

  clear = () => {
    this.sigPad.clear();
    this.handleOnEnd();
  };

  handleOnEnd = () => {
    this.setState({
      clearButtonDisabled: this.sigPad.isEmpty()
    });
    this.sigPad.canvas.toBlob((blob) => {
      this.props.handleOnEnd(this.sigPad && this.sigPad.isEmpty() ? null : blob);
    }, 'image/png', 0.95);
  };

  render() {
    return (
      <React.Fragment>
        <SignatureCanvas
          penColor={this.props.penColor}
          canvasProps={{ width: this.props.width,
            height: this.props.height,
            className: this.props.readOnly ? styles.signatureBodyReadOnly : styles.signatureBody }}
          onEnd={this.handleOnEnd}
          ref={ref => {
            this.sigPad = ref;
          }}
        />
      </React.Fragment>
    );
  }
}
Signature.defaultProps = {
  height: 70,
  width: 200,
  readOnly: false,
  penColor: '#263045',
  minWidth: 0.5
};
export { Signature };
