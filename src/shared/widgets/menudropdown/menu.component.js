import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import _debounce from 'lodash/debounce';

import { StoreProvider } from '../../store.provider';
import { MenuProvider } from './menu.context';

export class Menu extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    closeOnClick: PropTypes.bool,
    align: PropTypes.string,
    menuTargetId: PropTypes.string,
    position: PropTypes.object,
    openOnHover: PropTypes.bool,
    bubbleEvent: PropTypes.bool
  };

  static defaultProps = {
    closeOnClick: true,
    onClick: () => {},
    align: "left",
    position: {
      top: 0,
      left: 0
    },
    openOnHover: false,
    bubbleEvent: true
  }

  constructor(props) {
    super(props);

    this.dropDownManager = StoreProvider.createStore('dropdown', {});

    this.onClick = this.onClick.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.dropdownManagerCallback = this.dropdownManagerCallback.bind(this);

    this.state = {
      isMenuOpen: false,
      openOnHover: this.props.openOnHover,
      id: Math.ceil(Math.random() * 10000000),
      toggleMenu: this.onClick,
      debouncedToggleMenu: _debounce(this.onClick, 400),
      position: Object.assign({}, this.props.position)
    };
  }

  componentDidMount() {
    this.dropDownManager.observe('active', this.dropdownManagerCallback);
  }

  componentWillUnmount() {
    this.dropDownManager.destroy('active', this.dropdownManagerCallback);
  }

  dropdownManagerCallback(activeDropdown) {
    if(activeDropdown !== this) {
      //there should be only one dropdown can be opened across the app
      this.close();
    }
  }

  open() {
    this.onClick();
  }

  close() {
    if(this.state.isMenuOpen) {
      this.onClick();
    }
  }

  toggle() {
    this.onClick();
  }

  onClick() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
      position: Object.assign({}, this.props.position)
    }, () => {
      this.props.onClick();
      if(this.state.isMenuOpen) {
        this.dropDownManager.update('active', this);
        let menuElem = findDOMNode(this);
        //let menuParent = menuElem.parentElement;
        if(this.props.align === 'right') {
          let dropDownElem = document.querySelector(`.menu-content-${this.state.id}`);
          //let exceedingWidth = menuParent.right - (dropDownElem.offsetWidth + dropDownElem.offsetLeft);
          let dropDownLeft = (dropDownElem.offsetLeft + menuElem.offsetWidth) - dropDownElem.offsetWidth;
          this.setState((state) => {
            return {
              position: Object.assign(state.position, { left: dropDownLeft })
            };
          });
        }
        if(this.props.menuTargetId) {
          requestAnimationFrame(() => {
            let dropDownElem = document.querySelector(`.menu-content-${this.state.id}`);
            let menuLeft = parseInt(dropDownElem.style.left.replace('px'), 0);
            let menuTarget = document.querySelector(this.props.menuTargetId).getBoundingClientRect();
            let dropDownLeft = menuLeft - menuTarget.left;
            this.setState((state) => {
              let left = state.position.left - dropDownLeft;
              return {
                position: Object.assign(state.position, { left })
              };
            });
          });
        }
      }
    });
  }

  onItemClick(evt) {
    this.preventBubbling(evt);
    if(this.props.closeOnClick && this.state.isMenuOpen) {
      this.close();
    }
  }

  preventBubbling(evt) {
    if(!this.props.bubbleEvent) return;
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
  }

  render() {
    let { children, menuTargetId, closeOnClick, onClick, ...prop } = this.props;
    return (
      <div {...prop} onClick={this.onItemClick}>
        <MenuProvider value={this.state}>
          {
            React.Children.map(children, (child, index) => {
              if(React.isValidElement(child) && child.type.displayName === 'MenuHeader') return child;
              if(this.state.isMenuOpen) return child;
            })
          }
        </MenuProvider>
      </div>
    );
  }
}

// export function Menu(props) {
//   let { children, ...prop } = props;
//   let id = Math.ceil(Math.random() * 10000000);
//   return (
//     <div {...prop}>
//       {
//         React.Children.map(props.children, (children) => {
//           if(!React.isValidElement(children)) {
//             return children;
//           }
//           return React.cloneElement(children, { id });
//         })
//       }
//     </div>
//   );
// }
