import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./integrationCards.css";

class IntegrationCards extends Component {
  static propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    openLink: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.integrationCard} onClick={this.props.openLink}>
        <img src={this.props.image} alt="" />
        <p>{this.props.title}</p>
      </div>
    );
  }
}

IntegrationCards.defaultProps = {
  image: "",
  title: "",
  openLink: () => {}
};

export default IntegrationCards;
