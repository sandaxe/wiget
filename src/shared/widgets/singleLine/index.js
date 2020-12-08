import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './text.css';
export default class SingleLine extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.object
    ]),
    autoFocus: PropTypes.bool,
    className: PropTypes.string
  }

  componentDidMount() {
    if(this.props.autoFocus) {
      this._input.focus();
      this._input.selectionEnd = (this.props.value && this.props.value.length) || 0;
      this._input.selectionStart = (this.props.value && this.props.value.length) || 0;
    }
  }

  render() {
    /* TO DO: on Enter */
    let { autoFocus, className, ...props } = this.props;
    return (
      <input type="text" className={`sulli-input ${styles.singleLine} ${className}`}
        ref={input => { this._input = input; }} {...props} />
    );
  }
}

export const Input = React.forwardRef((props, ref) => {
  let { label, className, isRequired, onEnter, ...inputProps } = props;
  onEnter = onEnter || (() => {});

  const onKeyUp = (event) => {
    if(event.key === 'Enter') {
      onEnter();
    }
  };

  return (
    <React.Fragment>
      {label &&
        <label className={`${styles.label} ${props.inputCls}`}>
          {props.label}
          {props.isRequired &&
            <span className={styles.requiredLabel}>&nbsp;*</span>}
        </label>
      }
      <input ref={ref}
        className={`${styles.input} ${className} ${props.noBorder ? styles.noBorder : ''}`}
        type="text"
        onKeyUp={onKeyUp}
        autoFocus={true}
        {...inputProps} />
    </React.Fragment>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  isRequired: PropTypes.bool,
  noBorder: PropTypes.bool,
  inputCls: PropTypes.string
};

Input.defaultProps = {
  noBorder: true
};

export { SingleLine };
