import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './auth.css';

export class SettingUpAccountComponent extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  componentDidMount() {
    console.log('history', this.props.history);
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className="flex flex-xs-col flex-sm-col">
          <div className="col-5">
            <div className="onboard-l-cont">
              <div className="onb-logo flex">
                <div><img alt="" src={require('../shared/images/group-5@2x.png')} width="90"/></div>
                <p style={{ color: "#3079ed" }}>Engage</p>
              </div>
              <h3>Understand Customers</h3>
              <p>Outside the store, get reviews and</p>
              <img alt="" className="onb-bg" src={require('../shared/images/mobile.png')} width="400"/>
            </div>
          </div>
          <div className="col-5 onboard-r-cont">
            <h5>Setting up your account</h5>
            <div className={`${styles.onFormContainer} ${styles.largeFormContainer}`}>
              <div className={`${styles.onFormGroup}`}>
                <input type="text" className={styles.formControl} placeholder="Search for your" required/>
                <div className={`${styles.formControlPlaceholderStatic} flex`} htmlFor="name">
                  <a href="" className={`${styles.active} noBorder noDecoration`}>What's your Industry?</a>
                </div>
              </div>
              <div className={`flex-row flex-wrap ${styles.greenBorderedBtn}`}>
                <div className="col">
                  <a href="">Luxury</a>
                  <a href="">Automobile</a>
                  <a href="">Opticals</a>
                  <a href="">Cosmetics</a>
                  <a href="">Apparels & Fashion</a>
                  <a href="">Shoes</a>
                  <a href="">Watches</a>
                  <a href="">Multi- Products</a>
                  <a href="">B2B</a>

                  <a href="">Manufacturing</a>
                  <a href="">Boutique</a>
                  <a href="">Ornaments</a>
                  <a href="">Machinery</a>
                  <a href="">Home Business</a>
                  <a href="">Micro Business</a>
                </div>
              </div>
              <button type="submit">PROCEED TO ENGAGE</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
