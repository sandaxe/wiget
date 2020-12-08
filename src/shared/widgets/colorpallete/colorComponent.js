import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './colorComponent.css';


export class ColorComponent extends Component {
  static propTypes = {
    url: PropTypes.any,
    selectColor: PropTypes.func,
    mouseEnter: PropTypes.func,
    mouseOut: PropTypes.func,
    selected: PropTypes.bool
  };
  /*
  Color Component Props
  1. shapeColor : Shape of Container : Square, Circle
  2. colorHex : Hex Color #fff
  3. colorText : Text Of the color "White"
  */

  render() {
    let { url, selectColor, selected, mouseEnter, mouseOut } = this.props;
    return (
      <React.Fragment>
        <div className={selected ? styles.selectedcolorDiv : styles.colorDiv} onClick={selectColor}>
          {/* <p style={{ borderRadius: shapeColor === 'circle' ? '20px' : '3px', backgroundColor: colorHex, width: width,
            height: height, cursor: 'pointer' }} onClick={selectColor}>{addCross ? <img className={styles.crossMark} src={require('../../images/PD/fill-1.svg')} alt="Cross" /> : null }</p> */}
          {/* <img src={url} alt="glases" width="40" height="20"/> */}
          <img key={product._id} alt="glasses"
            src={url}
            width="40" height="20"
            onMouseEnter={mouseEnter}
            onMouseOut={mouseOut}
          />
        </div>
      </React.Fragment>


    );
  }
}


ColorComponent.defaultProps = {
  width: '35px',
  height: '35px'
};
