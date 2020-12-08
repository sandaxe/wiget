import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import styles from './icon.css';
/**
 * Description:
 * *name* and *size* properties are must for this component.
 * Refer Google Drive Resources folder to find available icons and sizes.
 */
class Icon extends Component {
  static propTypes = {
    /** Number - Specify icon size, Example - 12 (For 12X12 size) */
    size: PropTypes.number,
    /** String - Specify icon name, Example - 'Arrow' (Icon name without .svg) */
    name: PropTypes.string.isRequired,
    /** String - className to be passed into <Isvg> */
    boxClassName: PropTypes.string,
    /** String - className to be passed into Icon container */
    iconClassName: PropTypes.string,
    /** Boolean - To show border box  */
    box: PropTypes.bool,
    /** Function - Pass callback function for onClick */
    onClick: PropTypes.oneOf([PropTypes.func, PropTypes.bool])
  }

  static defaultProps = {
    box: false
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  componentDidCatch(err) {
    console.error('Icon catch', err);
  }

  onClick(evt) {
    if(this.props.onClick) {
      typeof this.props.onClick === 'function' && this.props.onClick(evt);
    }
  }

  render() {
    const { size, name, boxClassName = "", iconClassName = "", onClick, box, ...restProps } = this.props;
    let folder = size ? `${size}X${size}` : 'Custom';
    try {
      return (
        <span className={`${styles.iconContainer} ${box ? styles.box : ""} ${onClick ? styles.pointer : ""} 
          ${boxClassName}`} onClick={this.onClick} {...restProps}>
          <Isvg className={`${iconClassName} ${styles.iconSvg}`} src = {require(`./images/${folder}/${name}.svg`)}
            cacheGetRequests={true} />
        </span>
      );
    }catch (e) {
      let err = `Icon Error: ${(!name) ? 'name is missing in prop' : e.message}`;
      console.error(err);
      return <span title={err} >icon error</span>;
    }
  }
}

export default Icon;
