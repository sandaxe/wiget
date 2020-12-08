import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import DropdownBase, { DropdownTrigger, DropdownContent } from '../dropdown/dropdown.base';
import styles from './dropdown.button.css';

export class DropDownButton extends React.Component {
  static propTypes= {
    type: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.string,
    outline: PropTypes.bool,
    onClick: PropTypes.func,
    progress: PropTypes.func,
    buttonName: PropTypes.string,
    DropDownOptions: PropTypes.array,
    className: PropTypes.string
  }

  static defaultProps = {
    onClick: () => {}
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      inProgress: false
    };
  }

  componentWillUnmount() {
    this.unMounting = true;
  }

  onClick(option) {
    this.onClick && this.props.onClick(option.Value || option);
    this.dropdown.hide();
  }

  render() {
    const { type, size, outline, onClick, progress, className, buttonName,
      DropDownOptions, ...buttonProps } = this.props;

    const getClassName = () => {
      let className = styles.secondaryButton;
      if (type === 'action') {
        className = styles.actionButton;
      } else if (type === 'normal') {
        className = styles.normalButton;
      } else if(type === 'disable') {
        className = styles.disabledButton;
      }

      if(this.props.outline) {
        className = `${className} ${styles.outline}`;
      }

      if(this.props.size) {
        className = `${className} ${styles[this.props.size || 'small']}`;
      }

      if(this.state.inProgress) {
        className = `${className} ${styles.loading}`;
      }
      return className;
    };

    return (
      <DropdownBase className={`${styles.dropdown} ${styles.dropdownBtnMain}`}
        ref={dropdown => { this.dropdown = dropdown; }}>
        <DropdownTrigger>
          <div className={`${styles.buttonDropdown} ${styles.button} ${getClassName()}`} {...buttonProps}>
            <div className={styles.dropdownName}>{this.props.buttonName}</div>
            <Isvg className={`pointer ${styles.dropDownOptions}`}
              src={ require('./images/arrow.svg') } cacheGetRequests={true} />
          </div>
        </DropdownTrigger>
        <DropdownContent className={`${styles.buttonOptions} ${this.props.className}`}>
          <ul className={`${styles.dropdownSegment}`}>
            {this.props.DropDownOptions.map((options, index) =>
              (<li onClick={() => this.onClick(options)} className={`${styles.dropdownLink}`} key={index}>
                {options.Name || options }
              </li>)
            )}
          </ul>
        </DropdownContent>
      </DropdownBase>
    );
  }
}
