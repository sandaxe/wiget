import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import styles from './modal.css';


export class Modal extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    className: PropTypes.string,
    onClose: PropTypes.func,
    clickOutToClose: PropTypes.bool,
    size: PropTypes.string
  }

  static defaultProps = {
    clickOutToClose: true,
    onClose: () => {}
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      size: "default"
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.listenKeyboard = this.listenKeyboard.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.listenKeyboard);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.listenKeyboard);
  }

  listenKeyboard(e) {
    //close on Esc Key
    if (e.keyCode === 27) {
      this.close();
    }
  }

  handleClickOutside(event) {
    if (this.props.clickOutToClose) {
      this.close();
    }
  }

  open() {
    this.setState({
      open: true,
      size: this.props.size
    });
  }

  close() {
    this.setState({ open: false }, this.props.onClose);
  }

  preventBubbling = (evt) => {
    evt.stopPropagation();
    // evt.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { children, className } = this.props;
    const getClassName = () => {
      let className = styles.modalContainer;
      if(this.state.size) {
        className = `${className} ${styles[this.state.size]}`;
      }
      if(children.length === 2 && children[0].type.name === "ModalHeader") {
        className = `${className} ${styles.headerTypeModal}`;
      }
      if(children.length === 2 && children[0].type.name === "ModalContent") {
        className = `${className} ${styles.footerTypeModal}`;
      }
      return className;
    };
    return this.state.open ?
      createPortal(
        <div className={styles.modalWrapper} data-name="modalContainer" onClick={this.handleClickOutside}>
          <div className={`${className} ${getClassName()}`} onClick={this.preventBubbling}>
            {
              children
            }
          </div>
        </div>
        , document.body) :
      null;
  }
}

export const ModalHeader = (props) => {
  return (
    <div className={`${props.className} ${styles.modalHeader}`}>
      {
        props.children
      }
    </div>
  );
};
ModalHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export const ModalContent = (props) => {
  console.log('Model content props', props);
  let className = `${props.className} ${styles.modalContent}`;
  return (
    <div className={className}>
      {
        props.children
      }
    </div>
  );
};
ModalContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export const ModalFooter = (props) => {
  return (
    <div className={`${props.className} ${styles.modalFooter}`}>
      {
        props.children
      }
    </div>
  );
};

ModalFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

