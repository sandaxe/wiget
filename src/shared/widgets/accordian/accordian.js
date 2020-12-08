import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./accordianStyles.css";
import AccordionSection from "./accordionSection";

class Accordion extends Component {
  static propTypes = {
    allowMultipleOpen: PropTypes.bool,
    children: PropTypes.instanceOf(Object).isRequired
  };

  static defaultProps = {
    allowMultipleOpen: false
  };

  constructor(props) {
    super(props);

    const openSections = {};
    console.log("PROPSCHILDREN", this.props.children);
    this.props.children.forEach(child => {
      if (child.props.isOpen) {
        openSections[child.props.label] = true;
      }
    });

    this.state = { openSections };
  }

  onClick = label => {
    console.log("ONCLICK ACCORDIAN", label);
    const { props: { allowMultipleOpen }, state: { openSections } } = this;

    const isOpen = !!openSections[label];

    if (allowMultipleOpen) {
      this.setState({
        openSections: {
          ...openSections,
          [label]: !isOpen
        }
      });
    } else {
      this.setState({
        openSections: {
          [label]: !isOpen
        }
      });
    }
  };

  render() {
    const {
      onClick,
      props: { children },
      state: { openSections }
    } = this;

    return (
      <div className={styles.accordianStyle}>
        {children.map(child => (
          <AccordionSection
            key={child}
            isOpen={!!openSections[child.props.productID]}
            orderId={child.props.orderId}
            contactNumber={child.props.contactNumber}
            shopName={child.props.shopName}
            status={child.props.status}
            tabValue={child.props.tabValue}
            productPrice={child.props.productPrice}
            date={child.props.date}
            productID={child.props.productID}
            onClick={onClick}
          >
            {child.props.children}
          </AccordionSection>
        ))}
      </div>
    );
  }
}

export default Accordion;
