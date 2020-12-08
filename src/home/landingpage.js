import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { StoreProvider } from "../shared/store.provider";
import { AuthService } from "../auth/auth.service";
import styles from "./home.css";
import { toast } from "../shared/toast";

export class MainComponent extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: ""
    };
    this.homeStore = StoreProvider.createStore("Home", {
      processCache: {},
      studioState: "closed"
    });
    let appStore = StoreProvider.getStore("App");
    this.accountDetails = appStore.get("accountDetails");
    this.userDetails = appStore.get("userDetails");
    this.handleDataChange = this.handleDataChange.bind(this);
    this.signUp = this.signUp.bind(this);
    this.getPhoneNumber = this.getPhoneNumber.bind(this);
  }
  componentDidMount() {
    let appStore = StoreProvider.getStore("App");
    console.log("THISAPPSTORE", appStore);
    if(appStore.get("phoneNumberFromQuery") !== "") {
      this.setState({ phoneNumber: appStore.get("phoneNumberFromQuery") }, () => this.signUp());
    }
  }

  componentWillUnmount() {
    //StoreProvider.destroy('App');
    StoreProvider.destroy("Home");
  }

  handleDataChange() {
    this.props.history.push(`/profile/${this.userDetails._id}`);
  }

  getPhoneNumber(evt) {
    this.setState({ phoneNumber: parseInt(evt.target.value) ? parseInt(evt.target.value) : "" });
  }

  onEnter(e) {
    if (e.key === "Enter") {
      this.signUp();
    }
  }

  signUp() {
    let phoneNumber = this.state.phoneNumber.toString();
    if (phoneNumber.length !== 0 && phoneNumber.length !== 10) {
      toast.error("Please Enter a Valid Mobile Number");
      return;
    }
    if (phoneNumber.trim()) {
      let params = { phoneNumber: "91" + phoneNumber };
      sessionStorage.setItem("userPhoneNumber", this.state.phoneNumber);
      AuthService.signUp(params)
        .then(result => {
          this.props.history.push(`/auth`, {
            userSession: result,
            isPassword: result.data.passwordPresent ? "pwd" : "otp",
            phoneNumber: phoneNumber
          });
        })
        .catch(err => {
          toast.error("Please contact Support ");
        });
      return;
    }
    this.setState({ error: "Mobile Number is required" });
  }

  logout() {
    Service.get(`/signin/1/${this.accountDetails.id}/logout`)
      .then(data => {
        window.location.reload();
      })
      .catch(err => {
        console.log("failed to logout");
      });
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <header className={styles.MainHeader}>
          <div className={styles.container}>
            <div className="flex-row">
              <div className="col-1 flex-start-center ">
                <img alt="" src={require("../shared/images/group-5@2x.png")} width="70" />
              </div>
            </div>
          </div>
        </header>
        <div className={styles.mainContainer}>
          <div className={styles.homePageContainer}>
            <div className={styles.container}>
              <div className={styles.homeBanner}>
                <h1>
                  The all in one <strong>Platform</strong> which your Optical retail needs{" "}
                </h1>
                <p>Track Inventory > Gain Loyalty</p>
                <div className={styles.inlineForm}>
                  <input
                    type="tel"
                    placeholder="Mobile number"
                    pattern="^-?[0-9]\d*\.?\d*$"
                    maxLength="10"
                    value={this.state.phoneNumber}
                    onChange={this.getPhoneNumber}
                    onKeyDown={e => this.onEnter(e)}
                  />
                  <button type="submit" className={styles.BtnFullWidth} onClick={this.signUp}>
                    START GROWTH
                  </button>
                  {this.state.error && <label className={styles.errorMessage}>{this.state.error}</label>}
                </div>
              </div>
            </div>
            <div className={styles.secureLogoBadges}>
              <img alt="Secure Badge" src={require("../shared/images/secure/secureLogoGroup.png")} />
            </div>
            <img alt="" className={styles.homeBg} src={require("../shared/images/triangle-blue.png")} />
            <img alt="" className={styles.leadImg} src={require("../shared/images/svg/lead-image.svg")} />
          </div>
        </div>
      </div>
    );
  }
}
