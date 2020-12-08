import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from '../link';
import Icon from '../icon';

import styles from './breadcrumb.css';

export class Breadcrumb extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return(
      <div className={styles.breadCrumb}>
        { this.props.children }
      </div>
    );
  }
}

export function Nav(props) {
  let { readOnly, ...restProps } = props;
  return(
    <React.Fragment>
      { !props.readOnly ?
        (
          <Link className={`maruthamLink`} {...restProps}/>
        ) :
        <p>{props.children}</p>
      }
      <Icon className={styles.override} name="ArrowRight" size={16} />
    </React.Fragment>
  );
}

Nav.propTypes = {
  readOnly: PropTypes.bool,
  children: PropTypes.node
};
