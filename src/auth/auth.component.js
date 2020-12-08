import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-intl-tel-input/dist/libphonenumber.js';
import { StoreProvider } from '../shared/store.provider';
import { storeAuthTokens } from "../shared/utils";
import { Validator, Validation, ValidateHelper } from '../shared/validation';
import { AuthService } from './auth.service';
import Icon from "../shared/widgets/icon/index";
import { toast } from '../shared/toast';
import { decodeJWTToken } from '../shared/utils';
import styles from './auth.css';
import 'react-intl-tel-input/dist/main.css';

// const loadJSONP = (url, callback) => {
//   const ref = window.document.getElementsByTagName('script')[0];
//   const script = window.document.createElement('script');
//   script.src = `${url + (url.indexOf('?') + 1 ? '&' : '?')}callback=${callback}`;
//   ref.parentNode.insertBefore(script, ref);
//   script.onload = () => {
//     script.remove();
//   };
// };

// const lookup = (callback) => {
//   loadJSONP('http://ipinfo.io', 'sendBack');
//   window.sendBack = (resp) => {
//     const countryCode = (resp && resp.country) ? resp.country : '';
//     callback(countryCode);
//   };
// };

export class AuthComponent extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.homeStore = StoreProvider.createStore('Home', {
      processCache: {}
    });
    this.state = {
      phoneNumber: this.props.location.state ? this.props.location.state.phoneNumber : '',
      password: "",
      mode: this.props.location.state ? 'Signup' : 'Login',
      error: {},
      time: {}, seconds: 30,
      timer: 0,
      userSession: this.props.location.state ? this.props.location.state.userSession : '',
      countryData: {},
      isPassword: this.props.location.state ? this.props.location.state.isPassword : ""
    };
    let appStore = StoreProvider.getStore('App');
    this.accountDetails = appStore.get('accountDetails');
    this.userDetails = appStore.get('userDetails');
    this.getValidationRef = this.getValidationRef.bind(this);
    this.updateCredential = this.updateCredential.bind(this);
    this.onValidate = this.onValidate.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.changePhone1 = this.changeHandler.bind(this, 'phoneNumber');
    this.blurHandler1 = this.blurHandler.bind(this, 'phoneNumber');
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.editPhoneNumber = this.editPhoneNumber.bind(this);
    this.countDown = this.countDown.bind(this);
    this.signIn = this.signIn.bind(this);
    this.resendOTP = this.resendOTP.bind(this);
  }


  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    if (this.state.isPassword === 'otp') {
      this.startTimer();
    }
  }

  componentWillUnmount() {
    this.setState({ time: {}, seconds: 30 });
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }


  startTimer() {
    if (this.state.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    if (seconds === -1) {
      return 0;
    }
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);
    }
  }

  resendOtpHandler() {
    console.log("resend handling");
    this.setState({
      userSession: {
        data: {
          passwordPresent: false
        }
      },
      isPassword: 'otp',
      password: ''
    });
  }

  updateCredential(evt) {
    const { name, value } = evt.target;
    this.setState({ [name]: value });
  }

  changeHandler(name, isValid, value, countryData, number, ext) {
    this.setState({
      [name]: value,
      countryData: countryData
    });
  }

  blurHandler(name, isValid, value, countryData, number, ext) {
    this.setState({
      [name]: value,
      countryData: countryData
    });
  }

  onSignUp() {
    let err = this.validationRef.validate();
    if (err.phoneNumber) {
      this.onValidate(err);
    } else {
      let params = {
        phoneNumber: '91' + this.state.phoneNumber
      };
      AuthService.signUp(params).then((result) => {
        this.setState({ userSession: result });
        let password = result.data.passwordPresent;
        if (!password) { this.startTimer(); }
        this.isActivePassword(password ? 'pwd' : 'otp');
      }, (err) => {
        let error = this.state.error;
        error['UnhandledServerError'] = 'Please try again after sometime';
        this.setState({ error });
      });
    }
  }

  onEnter(e) {
    if (e.key === "Enter") {
      this.signIn();
    }
  }

  signIn() {
    let user = this.state.userSession;
    let err = this.validationRef.validate();
    if (err.phoneNumber || err.password) {
      this.onValidate(err);
      return;
    }
    let params = {};
    if (user["data"] && user.data['passwordPresent']) {
      params["passwordPresent"] = true;
      params["password"] = this.state.password;
      params["phoneNumber"] = '91' + this.state.phoneNumber;
    } else {
      params["passwordPresent"] = false;
      params["code"] = this.state.password;
      params["phoneNumber"] = '91' + this.state.phoneNumber;
    }
    AuthService.verify(params).then((result) => {
      let tokens = {
        "oic-authorization": result.data.tokens.token,
        "oic-refresh-token": result.data.tokens.refreshToken
      };
      StoreProvider.createStore('Tokens', tokens);
      storeAuthTokens(tokens);
      /*let decodedUser = decodeJWTToken(tokens['oic-authorization']);
      if(decodedUser) {
        if(decodedUser.role < 2) {
          this.props.history.push(`/tryon`);
          return;
        }
      }*/
      console.log(user);
      if (user.data['passwordPresent']) {
        if (result.data.showIndustryScreen) {
          this.props.history.push(`/onboarding`, {
            phoneNumber: this.state.phoneNumber
          });
          sessionStorage.setItem('userPhoneNumber', this.state.phoneNumber);
          return;
        } else if (!result.data.accountConfigurationDone) {
          this.props.history.push(`/usersettings`);
        } else {
          this.props.history.push(`/main/tryon`);
        }
      } else {
        this.props.history.push('/setpassword', {
          showIndustryScreen: result.data.showIndustryScreen,
          accountConfigurationDone: result.data.accountConfigurationDone
        });
      }
    }, (err) => {
      if (user.data['passwordPresent']) {
        toast.error("Invalid Password");
      } else {
        toast.error("OTP Validation Failed");
      }
    });
  }

  resendOTP() {
    let err = this.validationRef.validate();
    if (err.phoneNumber) {
      this.onValidate(err);
    } else {
      let params = {
        phoneNumber: `91${this.state.phoneNumber}`
      };
      AuthService.resendOTP(params).then((result) => {
        this.resendOtpHandler();
        this.startTimer();
      }, (err) => {
        toast.error('Cannot Send OTP Please try sometimes later');
      });
    }
  }

  editPhoneNumber() {
    this.setState({ isPassword: '' });
  }

  onValidate(error) {
    this.setState((prevState) => {
      return { error: Object.assign(prevState.error, error) };
    });
    console.log('errors', error);
  }

  isActivePassword = (pwd) => {
    this.setState({
      isPassword: pwd
    });
  }

  getValidationRef(ref) {
    this.validationRef = ref;
  }

  logout() {
    this.props.history.push(`/home`);
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className="flex flex-xs-col flex-sm-col">
          <div className="col-5 col-sm-12">
            <div className="onboard-l-cont">
              <div className="onb-logo flex">
                <div><img src={require('../shared/images/group-5@2x.png')} alt="" width="90" /></div>
                {/* <p style={{ color: "#3079ed" }}>Engage</p> */}
              </div>
              <h4>Welcome to the most <strong>"Distruptive"</strong> Retail Platform</h4>
              <p>Track items > Engage on store > Build loyalty > Get More Walkins > Sell More </p>
              <img className="onb-bg" alt="" src={require('../shared/images/onboard-bg.png')} />
            </div>
          </div>
          <div className="col-5 col-sm-12 onboard-r-cont">
            {
              this.state.mode === 'Signup' ?
                <h5>One step closer to creating account</h5> :
                <h5>Great to see you again!</h5>
            }
            {this.timer !== 0 && this.state.time.s !== 0 &&
              <h6>Sending OTP in : <strong>{this.state.time.s}</strong></h6>}
            <div className={styles.onFormContainer}>
              <Validation ref={this.getValidationRef}>
                <div className={styles.formContainer}>
                  <div className={`${styles.onFormGroup} ${this.state.error.phoneNumber ? styles.error : ''}`}>
                    <p className={`${styles.fieldLabel}`}
                      htmlFor="name">Mobile Number</p>
                    <div className={styles.editInput}>
                      <Validator name="phoneNumber" value={this.state.phoneNumber}
                        onValidate={this.onValidate}
                        validations={[ValidateHelper.required]}>
                        <input type="text" className={`${styles.formControl} ${styles.whiteBg}`}
                          name="phoneNumber"
                          placeholder={'Mobile number'}
                          disabled={this.state.isPassword !== ''}
                          value={this.state.phoneNumber}
                          onChange={this.updateCredential}
                        />
                      </Validator>
                      {/*
                        this.state.isPassword !== '' &&
                      <Icon onClick={this.editPhoneNumber} name="Edit" size={"24"} />
                      */}
                    </div>
                    {/* <span className={styles.reload}><a href=""><img alt=""
                      src={require('../shared/images/group.png')}/></a></span>
                    <span onClick={this.onSignUp} className={styles.resend}>RE-SUBMIT</span>
                    {this.state.error.phoneNumber && <span className={styles.errIcon}>
                      <img src={require('../shared/images/alert-icon-2.png')} alt="" width="16"/></span>} */}
                    {this.state.error.phoneNumber &&
                      <span className={styles.errorMessage}>Mobile Number is not valid</span>}
                  </div>
                  {this.state.isPassword &&
                    <div className={`${styles.onFormGroup} ${styles.passwordField}
                    ${this.state.error.phoneNumber ? styles.error : ''}`}>
                      <p className={`${styles.fieldLabel}`}
                        htmlFor="name">{this.state.isPassword === 'otp' ? 'OTP' : 'Password'}</p>
                      {this.state.isPassword === 'otp' && <Validator name="password" value={this.state.password}
                        onValidate={() => this.state.userSession ? this.onValidate : this.dummy = {}}
                        validations={[ValidateHelper.required]}>
                        <input className={styles.formControl} placeholder="OTP - Six Digit Number" type="text" autoComplete="off"
                          name="password"
                          value={this.state.password}
                          onChange={this.updateCredential} />
                      </Validator>}
                      {this.state.isPassword === 'pwd' && <Validator name="password" value={this.state.password}
                        onValidate={() => this.state.userSession ? this.onValidate : this.dummy = {}}
                        validations={[ValidateHelper.required]}>
                        <input className={styles.formControl} placeholder="Enter your password" type="password"
                          name="password"
                          value={this.state.password}
                          onChange={this.updateCredential}
                          onKeyPress={this.onSignUp}
                          onKeyDown={e => this.onEnter(e)}/>
                      </Validator>}
                      <span onClick={this.resendOTP} className={styles.resend}>{this.state.isPassword === 'otp' ? 'Resend-OTP' : 'Forgot Password'}</span>
                      {this.state.error.phoneNumber && <span className={styles.errIcon}>
                        <img src={require('../shared/images/alert-icon-2.png')} alt="" width="16" /></span>}
                      {this.state.error.password && this.state.isPassword === 'pwd' &&
                        <span className={styles.errorMessage}>Password is not valid</span>}
                      {this.state.error.password && this.state.isPassword !== 'pwd' &&
                        <span className={styles.errorMessage}>OTP is not valid</span>}
                    </div>
                  }
                </div>
                {
                  this.state.error.UnhandledServerError &&
                  <div style={{ marginTop: '40px', textAlign: 'center', color: 'red' }}>
                    {this.state.error.UnhandledServerError}
                  </div>
                }
                {
                  this.state.isPassword ? (
                    <button onClick={this.signIn}
                      onKeyPress={this.signIn}
                      className={`${this.state.password ? '' : styles.disabledBtn}`}
                      type="submit">{'Proceed'}</button>
                  ) :
                    (<button onClick={this.onSignUp}
                      className={`${this.state.phoneNumber ? '' : styles.disabledBtn}`}>Next</button>)
                }
              </Validation>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
