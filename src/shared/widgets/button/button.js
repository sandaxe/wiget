import React from 'react';
import PropTypes from 'prop-types';

import styles from './button.css';

export class Button extends React.Component {
  static propTypes= {
    type: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.string,
    outline: PropTypes.bool,
    onClick: PropTypes.func,
    progress: PropTypes.func
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

  onClick(evt) {
    if(this.props.progress) {
      this.setState({ inProgress: true });
      this.props.progress(evt)
        .finally(() => {
          !this.unMounting && this.setState({ inProgress: false });
        });
    } else {
      this.props.onClick(evt);
    }
  }

  render() {
    const { type, size, outline, onClick, progress, ...buttonProps } = this.props;

    const getClassName = () => {
      let className = styles.secondaryButton; // gray colour button
      if (type === 'action') {
        className = styles.actionButton; // green color button
      } else if (type === 'normal') {
        className = styles.normalButton; // dusk color button
      } else if(type === 'disable') {
        className = styles.disabledButton; // pale-gray color button
      } else if(type === 'link') {
        className = styles.linkButton; // green color link button
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
      <button type="button" onClick={this.onClick}
        className={`${styles.button} ${getClassName()}`} {...buttonProps}>
        {this.props.children}
      </button>
    );
  }
}
