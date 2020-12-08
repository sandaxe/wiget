import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './checkbox.css';
class CheckBox extends Component {
  static propTypes = {
    value: PropTypes.bool,
    label: PropTypes.string,
    filled: PropTypes.bool,
    strike: PropTypes.bool,
    className: PropTypes.string,
    customClass: PropTypes.string,
    labelClass: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool
  };

  dummy() {

  }

  render() {
    let { value, filled, className, label, strike, readOnly, customClass, disabled,
      labelClass, ...props } = this.props;
    let checked = value != null ? value : false || false;
    filled = filled != null ? filled : false;
    let disabledReadonly = (disabled || readOnly) ? (disabled || readOnly) : false;
    return (
      <label className={`${styles.checkBoxContainer} ${className}`}>
        <div className={`${styles.checkBoxContent} ${customClass}`}>
          <input className={`${styles.checkmark} ${disabled ? styles.disabled : ''}`}
            disabled={disabledReadonly}
            type="checkbox" onChange={this.dummy} checked={checked} {...props} />
          <span className={`${styles.checkmark}
           ${readOnly && checked ? styles.readOnly : ''} ${(!readOnly && !disabled) ? styles.notReadOnly : ''}
           ${filled ? styles.filledInBox : styles.notFilled}`}/>
        </div>
        {label && <div className={`${styles.checkBoxLabel} ${(!readOnly && !disabled) ? styles.pointer : ''}
        ${disabled ? styles.disabled : ''} ${strike && checked ?
        styles.strikeOnSelect : ''} ${labelClass}`}>
          {label}
        </div>}
      </label>
    );
  }
}

CheckBox.defaultProps = {
  filled: true,
  disabled: false,
  readOnly: false,
  value: false,
  strike: false
};

export { CheckBox };

//filled={true}
