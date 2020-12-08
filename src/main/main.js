import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { StoreProvider } from '../shared/store.provider';
import { AuthService } from '../auth/auth.service';
import styles from './main.css';
import Tryon from "../tryon/tryon.component";
import Capturecomponent from "../tryon/capture";
export class Main extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    let appStore = StoreProvider.getStore('App');
    this.accountDetails = appStore.get('accountDetails');
    this.state = {
      phoneNumber: '',
      accountData: appStore.state["accountData"]
    };
    this.homeStore = StoreProvider.createStore('Home', {
      processCache: {},
      studioState: "closed"
    });
    this.userDetails = appStore.get('userDetails');
    this.handleDataChange = this.handleDataChange.bind(this);
    this.signUp = this.signUp.bind(this);
    this.getPhoneNumber = this.getPhoneNumber.bind(this);
  }

  componentWillUnmount() {
    //StoreProvider.destroy('App');
    StoreProvider.destroy('Home');
  }

  handleDataChange() {
    this.props.history.push(`/profile/${this.userDetails._id}`);
  }

  getPhoneNumber(evt) {
    this.setState({ phoneNumber: evt.target.value, error: '' });
  }

  signUp() {
    if (this.state.phoneNumber.trim()) {
      let params = { phoneNumber: '91' + this.state.phoneNumber };
      AuthService.signUp(params).then((result) => {
        this.props.history.push(`/auth`, {
          isPassword: result.data.passwordPresent ? 'pwd' : 'otp',
          phoneNumber: params.phoneNumber,
          userSession: result.data
        });
      });
      return;
    }
    this.setState({ error: 'Mobile Number is required' });
  }

  logout() {
    Service.get(`/signin/1/${this.accountDetails.id}/logout`)
      .then((data) => {
        window.location.reload();
      }).catch((err) => {
        console.log('failed to logout');
      });
  }

  render() {
    let pathName = this.props.history.location.pathname;

    return (
      <div className={styles.mainContainer}>
        {
          (pathName === '/main/' || pathName === '/main') && <Redirect to="/main/tryon" />
        }
        
        
        <div className={`${styles.adminMain} flex`}>
          
          
          <div className={`${styles.adminWrapper}`}>
            <Route path={`/main/tryon`} render={(props) => {
              return (
              <Tryon {...props} />
              );
            }}/>
            <Route path={`/main/capture`} render={(props) => {
              return (
              <Capturecomponent {...props} />
              );
            }}/>

            
            
              

          </div>
          
        </div>
      </div>
    );
  }
}
