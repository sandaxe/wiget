import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.css';

export default class LazyLoader extends Component {
  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    percentage: PropTypes.number,
    custom: PropTypes.bool
  }
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.cardLoader}/>
      </div>
    );
  }
}

