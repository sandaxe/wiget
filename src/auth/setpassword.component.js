import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StoreProvider } from '../shared/store.provider';
import styles from './auth.css';
import { toast } from '../shared/toast';
import { AuthService } from './auth.service';

export class SetPasswordComponent extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.homeStore = StoreProvider.createStore('Home', {
      processCache: {},
      studioState: "closed"
    });
    this.state = {
      passwordVisible: false,
      setpasswordVisible: false,
      passwordVerify: '',
      password: '',
      showIndustryScreen: this.props.location.state ? this.props.location.state.showIndustryScreen : false
    };
    this.passwordVisible = this.passwordVisible.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    console.log(this.props);
  }

  passwordVisible(e, param) {
    if (param === 'set') {
      this.setState({
        setpasswordVisible: !this.state.setpasswordVisible
      });
    } else if (param === 'create') {
      this.setState({
        passwordVisible: !this.state.passwordVisible
      });
    }
  }

  setPassword(name, value) {
    let obj = {};
    obj[name] = value;
    this.setState(
      obj
    );
  }

  handleSubmit() {
    const Exp = /(([a-z]{1,}[0-9]{1,})|([0-9]{1,}[a-z]{1,}))+[a-z0-9]*/gi;
    if (this.state.passwordVerify.length < 6) {
      toast.error('Password needs to be more than 6 chars');
      return;
    }
    if (!this.state.passwordVerify.match(Exp)) {
      toast.error("Password is not Strong ! Use atleast one number and one character");
      return;
    }
    if (!(this.state.password === this.state.passwordVerify)) {
      toast.error('Password doesnt match');
      return;
    }
    let data = {
      password: this.state.password
    };
    AuthService.setPassword(data).then(result => {
      toast.success('Password Updated Sucessfully');
      if (this.state.showIndustryScreen) {
        this.props.history.push('/onboarding');
      } else {
        this.props.history.push('/main/marketplace');
      }
    }).catch(err => {
      toast.error('Password Not updated Please try again');
    });
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className="flex flex-xs-col flex-sm-col">
          <div className="col-5 col-sm-12">
            <div className="onboard-l-cont">
              <div className="onb-logo flex">
                <div><img alt="" src={require('../shared/images/group-5@2x.png')} width="90" /></div>
                <p className="SmHidden" style={{ color: "#3079ed" }}>Engage</p>
              </div>
              <h3>Welcome to Engage.</h3>
              <p>Best way to engage with you customers</p>
              <img alt="" className="onb-bg" src={require('../shared/images/onboard-bg.png')} />
            </div>
          </div>
          <div className="col-5 col-sm-12 onboard-r-cont">
            <h5>One step closer to resetting your password</h5>
            <div className={styles.onFormContainer}>
              <div className={styles.onFormGroup}>
                <input type={this.state.passwordVisible ? 'text' : 'password'}
                  className={styles.formControl} required placeholder="Min 6 characters, Alphanumeric password"
                  value={this.state.passwordVerify}
                  onChange={(evt) => { this.setPassword('passwordVerify', evt.target.value); }} />
                <label className={styles.formControlPlaceholder} htmlFor="name">Set Password</label>
                <span className={!this.state.passwordVisible ? styles.icons : styles.passwordVisible}
                  onClick={(e) => { this.passwordVisible(e, 'create'); }}>
                  <img alt="" src={require('../shared/images/eye-open.png')} /></span>
                <ul className={styles.bullets}>
                  <li /><li /><li /><li />
                </ul>
              </div>
              {/* <div className={`${styles.onFormGroup} flex noMargin`}>
                <label className={styles.customCheck}>Remember me
                  <input type="checkbox" checked="checked"/>
                  <span className={styles.checkmark} />
                </label></div>*/}

              <div className={styles.onFormGroup}>
                <input type={this.state.setpasswordVisible ? 'text' : 'password'}
                  value={this.state.password} placeholder="Min 6 characters, Alphanumeric password"
                  onChange={(evt) => { this.setPassword('password', evt.target.value); }}
                  className={styles.formControl} required />
                <label className={styles.formControlPlaceholder} htmlFor="name">Retype Password</label>
                <span className={!this.state.setpasswordVisible ? styles.icons : styles.passwordVisible}
                  onClick={(e) => { this.passwordVisible(e, 'set'); }}>
                  <img alt="" src={require('../shared/images/eye-open.png')} /></span>
                <ul className={styles.bullets}>
                  <li /><li /><li /><li />
                </ul>
              </div>
              <button type="submit" onClick={this.handleSubmit}>Set Password</button>
              {/*<button className="transpBtn" type="submit">SKIP</button>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
