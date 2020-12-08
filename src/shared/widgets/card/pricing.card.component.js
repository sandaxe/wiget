import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './card.css';
import { PrimaryButton, SecondaryButton, GhostButton } from "../button";

export class PricingCardComponent extends Component {
  static propTypes = {
    recommended: PropTypes.bool,
    title: PropTypes.string.isRequired,
    totalPrice: PropTypes.string.isRequired,
    strikedAmount: PropTypes.string.isRequired,
    discountedText: PropTypes.string,
    per: PropTypes.string.isRequired,
    features: PropTypes.array.isRequired,
    action: PropTypes.func.isRequired,
    selected: PropTypes.bool
  };
  /*
  Card Component Props
  recommended: false,
  title: 'Trail Pack',
  totalPrice: 'Free',
  discountedText: '',
  per: "45 Days",
  features:
  */

  /*
  Example Data
  {
    Recommended: True,
    Title: "",
    TotalPrice: format(12000),
    Per:["Quater", "45 Days"],
    Features: ["","",""]
  }
  */

  render() {
    return (
      <div className={styles.pricingCard} onClick={this.props.action}>
        {this.props.recommended ? <div className={styles.recommended}>
          <p>Recommended</p>
        </div> : <div className={styles.notrecommend} />}
        <div className={styles.pricingCardTitle}>
          <p>{this.props.title}</p>
        </div>
        <div className={styles.totalPrice}>
          <p className={styles.strikedprice}>Rs. {this.props.strikedAmount}</p>
          <p className={styles.price}>{this.props.totalPrice}<small className={styles.gstName}> + GST</small></p>
          <p className={styles.pricePer}>{`/${this.props.per}`}</p>
        </div>
        <p className={styles.discountedPrice}>{this.props.discountedText}</p>
        <div className={styles.features}>
          <ul>
            {this.props.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
        <div className={styles.actionButtons}>
          {this.props.selected ? <PrimaryButton size="normal" type="action">CHOOSEN PLAN</PrimaryButton> : <SecondaryButton size="normal" type="action">CHOOSE PLAN</SecondaryButton> }
        </div>

      </div>);
  }
}

PricingCardComponent.defaultProps = {
  recommended: false
};
