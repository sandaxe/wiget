import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './loader.css';
import Isvg from 'react-inlinesvg';

export class Loader extends Component {
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
      <div className={`${styles.loaderContainer} ${this.props.className}`}>
        {!this.props.custom && <div className={styles.ldsSpinner}>
          {this.props.percentage && <p className={styles.percentage}>{this.props.percentage}%</p>}
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div> }
        {!this.props.custom && <div className={styles.loading}>{this.props.message}</div>}
        {this.props.custom && <div className={styles.newLoader}>
          <Isvg src={require(`./loader.svg`)} cacheGetRequests={true} />
          <div style={{ paddingTop: "100px" }}
            className={styles.loading}>{this.props.message}
          </div>
        </div>}
      </div>

    );
  }
}
