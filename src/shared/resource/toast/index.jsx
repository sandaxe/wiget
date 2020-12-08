import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';

import styles from './toast.css';

export const ToastBox = ({ messages, type }) => {
  type = type || 'info';
  let icon = {
    info: <React.Fragment>&#x2713;</React.Fragment>,
    error: "!"
  };

  return (
    <div className={`${styles.toastBox} ${styles[type]}`}>
      <ul className={styles.message}>
        {
          messages.map(message => {
            return (
              <li key="message">
                <div className={styles.icon}>{icon[type]}</div>
                <div className={styles.text}>{message}</div>
              </li>
            );
          })
        }
      </ul>
      <Isvg src={require('./images/icons8-cross-mark.svg')} cacheGetRequests={true}/>
    </div>
  );
};

ToastBox.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string
};
