import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '../button';
import { Link } from '../link';
import styles from './modal.css';
export class ModalFilter extends Component {
  static propTypes = {
    title: PropTypes.string,
    save: PropTypes.func,
    children: PropTypes.any,
    cancel: PropTypes.func,
    btnName: PropTypes.string,
    linkButtonNeeded: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      storeObj: {}
    };
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentWillMount() {
    document.body.classList.add(styles.body);
  }

  componentWillUnmount() {
    document.body.classList.remove(styles.body);
  }

  save() {
    this.props.save && this.props.save(this.state.storeObj);
  }

  cancel() {
    this.props.cancel && this.props.cancel();
  }

  render() {
    return (
      <div className={`${styles.createModel}`}>

        <div className={`${styles.createModelContent}`}>
          {/* <div className={`${styles.emptyContent}`}>
           &nbsp;
          </div> */}
          <div className={styles.FilterPopup}>
            {/* <div className={styles.formClose}>
              close
            </div> */}
            <div>
              <h4>{this.props.title}</h4>{this.props.linkButtonNeeded ?
                <React.Fragment>
                  <Link onClick={this.cancel} type={''}>Cancel</Link>
                  <Button onClick={this.save} type={'primary'}>{this.props.btnName ? this.props.btnName : 'Save'}</Button>
                </React.Fragment> : null }
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ModalFilter.defaultProps = {
  linkButtonNeeded: true
};
