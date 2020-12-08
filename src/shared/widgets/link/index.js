import React from 'react';
import PropTypes from 'prop-types';

import styles from './link.css';

export function Link({ children, className, disabled, onClick, ...props }) {
  return (<a className={`${className} ${styles.link} ${disabled ? styles.disabled : styles.notDisabled}`}
    onClick={ disabled ? () => {console.log("Is disabled");} : onClick}
    {...props}>{children}</a>);
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

Link.defaultProps = {
  className: ""
};
