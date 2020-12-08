import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';

import { DropdownMenu } from '../menudropdown';

import styles from './button.css';

class NormalButton extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.string,
    type: PropTypes.string,
    shape: PropTypes.string,
    progress: PropTypes.func,
    onClick: PropTypes.func
  }

  static defaultProps = {
    className: "",
    size: 'normal',
    type: '',
    onClick: () => {}
  }

  constructor(props) {
    super(props);
    this.state = {
      inProgress: false
    };
  }

  onClick = (evt) => {
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
    let { className, size, type, onClick, progress, shape, ...restProps } = this.props;
    if(this.state.inProgress) {
      className = `${className} ${styles.loading}`;
    }
    return (<button className={`marutham-body ${styles.button} ${styles[size]} ${styles[type]}
    ${styles[shape]} ${className}`}
    onClick={this.onClick} {...restProps} />);
  }
}

export const Button = NormalButton;

export function PrimaryButton(prop) {
  const { className, ...restProps } = prop;
  return <NormalButton className={`${styles.primary} ${className}`} {...restProps}/>;
}

export function SecondaryButton(prop) {
  const { className, ...restProps } = prop;
  return <NormalButton className={`${styles.secondary} ${className}`} {...restProps}/>;
}

export function GhostButton(prop) {
  const { className, ...restProps } = prop;
  return <NormalButton className={`${styles.ghost} ${className}`} {...restProps}/>;
}

export function IconButton(prop) {
  const { className, ...restProps } = prop;
  let iconClass = React.Children.count(prop.children) === 1 ? styles.iconButton : "";
  return <NormalButton className={`${iconClass} ${className}`} {...restProps}/>;
}

export const SplitButton = React.forwardRef((props, ref) => {
  return <SplitButtonComp {...props} forwardRef={ref}/>;
});

class SplitButtonComp extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.node,
    trigger: PropTypes.node,
    children: PropTypes.node,
    type: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    align: PropTypes.string,
    forwardRef: PropTypes.object
  }

  static defaultProps = {
    className: "",
    title: "button",
    type: 'normal',
    size: 'normal',
    disabled: false,
    align: 'right',
    onClick: () => {},
    forwardRef: React.createRef()
  }

  renderTrigger() {
    if(this.props.trigger) {
      return this.props.trigger;
    }
    let { size, type, title, ...restProps } = this.props;
    return <NormalButton type={type} size={size} {...restProps}>{title}</NormalButton>;
  }

  render() {
    const { className, type, size, disabled } = this.props;
    const disabledClass = disabled ? styles.disabled : "";
    return (
      <div className={`${styles.button} ${styles[size]} ${styles.splitButton}
        ${styles[type]} ${disabledClass} ${className}`} tabIndex={1}>
        {
          this.renderTrigger()
        }
        <DropdownMenu.Menu ref={this.props.forwardRef} align={this.props.align} bubbleEvent={false}>
          <DropdownMenu.Header className={styles.menuTrigger}>
            <Isvg src={require('./images/arrow.svg')} />
          </DropdownMenu.Header>
          <DropdownMenu.Content>
            <ul className={styles.menuDropdown}>
              {
                this.props.children
              }
            </ul>
          </DropdownMenu.Content>
        </DropdownMenu.Menu>
      </div>
    );
  }
}

export function MenuItem(prop) {
  return <li className={styles.menuItem} {...prop} />;
}

export function GroupButton(prop) {
  let childrens = React.Children.map(prop.children, (button) => {
    let className = `${styles.groupButton} ${button.props.className || ''}`;
    if(button.props.selected) {
      className = `${className} ${styles.active}`;
    }
    return React.cloneElement(button, { className });
  });
  let { children, type, ...restProps } = prop;
  return <div className={`${styles.buttonGroups} ${styles[type]}`} {...restProps}>{childrens}</div>;
}
