import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./priceCard.css";

class PriceCard extends Component {
  static propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    price: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img className={styles.image} src={this.props.image} alt="" />
        </div>
        <h1 className={styles.title}>{this.props.title}</h1>
        <div className={styles.description}>{this.props.desc}</div>
        <div className={styles.price}>{this.props.price}</div>
        <button className={styles.signUp}>
          <span className={styles.btnText}>Choose</span>
        </button>
      </div>
    );
  }
}

PriceCard.defaultProps = {
  image: "",
  title: "",
  desc: "",
  price: ""
};

export default PriceCard;
