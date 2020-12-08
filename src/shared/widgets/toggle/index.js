import React from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import styles from './toggle.css';

const False = { left: '0%', gridColumn: '1/2', borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px' };
const True = { left: '100%', gridColumn: '1/2', borderTopRightRadius: '3px', borderBottomRightRadius: '3px' };

class Toggle extends React.Component {
  static propTypes = {
    trueValue: PropTypes.string,
    falseValue: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func,
    value: PropTypes.bool,
    className: PropTypes.string,
    isError: PropTypes.bool
  }

  static defaultProps = {
    className: ''
  }

  componentDidMount() {
    let element = ReactDOM.findDOMNode(this);
    let yesElement = element.getElementsByClassName(`${styles.yes}`)[0];
    let yesWidth = yesElement.getBoundingClientRect().width;
    let noElement = element.getElementsByClassName(`${styles.no}`)[0];
    let noWidth = noElement.getBoundingClientRect().width;
    let switchElement = element.getElementsByClassName(`${styles.switch}`)[0];
    if(yesWidth > noWidth) {
      noElement.style.width = yesWidth + 'px';
      switchElement.style.width = yesWidth + 'px';
      noWidth = yesWidth;
    }else{
      yesElement.style.width = noWidth + 'px';
      switchElement.style.width = noWidth + 'px';
      yesWidth = noWidth;
    }
    element.style.width = noWidth + yesWidth + 'px';
  }

  state={
    checked: this.props.value || false
  }

  handleChange=(e) => {
    this.props.handleChange(e, !this.props.value);
  }

  handleKeyUp=(e) => {
    if(e.keyCode === 13) {
      this.handleChange(e);
    }if(e.keyCode === 32) {
      e.stopPropagation();
      e.preventDefault();
      this.handleChange(e);
    } // scrolls down on space
  }

  render() {
    const trueValue = this.props.trueValue || 'Yes';
    const falseValue = this.props.falseValue || 'No';
    return (
      <div className={`${styles.toggleContainer} ${this.props.className}
       ${this.props.isError ? styles.errorStyle : '' }`} tabIndex="0"
      onClick={this.handleChange}
      onKeyUp={this.handleKeyUp}
      onBlur={this.props.handleBlur}>
        <div className={`${styles.optionContainer} ${styles.yes}`}>{trueValue}</div>
        <div className={`${styles.optionContainer} ${styles.no}`}>{falseValue} </div>
        <div className={styles.switch} style={this.props.value ? True : False} >
          {this.props.value ? falseValue : trueValue}
        </div>
      </div>
    );
  }
}

export { Toggle };

