import React from 'react';
import PropTypes from 'prop-types';

import styles from './radio.css';

export function Radio(props) {
  let { className, onChange, checked, label, id, space, ...rest } = props;
  return (
    <label tabIndex={0} htmlFor={id}
      className={`${styles.checkbox} ${space ? styles.colorP : ''} ${styles.radio}
    ${rest.disabled ? `${styles.cursorNoDrop}` : ''}`}>
      <input type="radio" checked={checked} onChange={onChange} id={id} {...rest}/>

      <span className={styles.checkmark}><span className={styles.dot}/></span>
      {space && <span className={`${className}`}>&nbsp;</span>}
      <span className={`marutham-body`}>{label}</span>
    </label>
  );
}

Radio.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  space: PropTypes.bool,
  beforeClass: PropTypes.string
};

Radio.defaultProps = {
  className: "",
  label: "",
  beforeClass: "",
  space: false
};
