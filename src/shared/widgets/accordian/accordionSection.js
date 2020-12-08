import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./accordianStyles.css";
class AccordionSection extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
    isOpen: PropTypes.bool.isRequired,
    orderId: PropTypes.string.isRequired,
    productPrice: PropTypes.string.isRequired,
    contactNumber: PropTypes.any,
    tabValue: PropTypes.any,
    status: PropTypes.any,
    shopName: PropTypes.any,
    date: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    productID: PropTypes.any
  };
  onClick = () => {
    this.props.onClick(this.props.productID);
  };

  render() {
    const { onClick, props: {
      isOpen,
      orderId,
      productPrice,
      date,
      tabValue,
      status,
      contactNumber,
      shopName } } = this;

    return (
      <div
        className={styles.accordianSectionsStyle}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div>
          <div className={tabValue === "History" ? `${styles.myHistoryHeader}` : `${styles.myOrderHeader}`}>
            <p>{orderId}</p>
            <p>{contactNumber}</p>
            <p>{shopName}</p>
            <p>{date}</p>
            <p>{productPrice}</p>
            {tabValue === "History" && <p>{status}</p>}
            {!isOpen && <p className={styles.arrowMobileRight}/>}
            {isOpen && <p className={styles.arrowMobileDown}/>}
          </div>
        </div>
        {isOpen && (
          <div className={styles.isOpenHeader}>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

export default AccordionSection;
