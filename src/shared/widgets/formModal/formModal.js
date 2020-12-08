import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./formModal.css";

class FormModal extends Component {
  static propTypes = {
    children: PropTypes.func,
    close: PropTypes.func,
    title: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div onClick={this.props.close} className={styles.modalWrapper}>
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={styles.modalContainer}
        >
          <div className={styles.modelHeader}>
            <header>{this.props.title}</header>
            <div onClick={this.props.close} className={styles.modelClose}>
              <img
                src={require("../../images/dashboard/icons/close.png")}
                width="14"
                alt=""
              />
            </div>
          </div>
          <div className={styles.modalContent}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

FormModal.defaultProps = {
  children: () => {},
  close: () => {},
  title: ""
};

export default FormModal;
