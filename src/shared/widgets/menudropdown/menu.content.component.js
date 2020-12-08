import React from 'react';
import PropTypes from 'prop-types';

import { MenuConsumer } from './menu.context';
import { RelativePortal } from '../../components/portal';

export function MenuContent(props) {
  return (
    <MenuConsumer>
      {
        ({ isMenuOpen, id, toggleMenu, position }) => {
          return (<MenuContentRenderer isMenuOpen={isMenuOpen}
            position={position}
            id={id} onClose={toggleMenu} {...props}/>);
        }
      }
    </MenuConsumer>
  );
}
class MenuContentRenderer extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    children: PropTypes.node,
    onClose: PropTypes.func,
    isMenuOpen: PropTypes.bool,
    position: PropTypes.object
  };

  static defaultProps = {
    onClose: () => {}
  }

  componentDidMount() {
    this.outClick = this.outClick.bind(this);
    if(this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    this.frameId = requestAnimationFrame(() => this.setOpenDirection());
    //this.setOpenDirection();
    //document.addEventListener('mousewheel', this.rePositionDirection);
    document.addEventListener('click', this.outClick);
    document.addEventListener("keydown", this.listenKeyboard);
    this.containerElem = document.querySelector(`.menu-content-${this.props.id}`);
  }

  componentWillReceiveProps() {
    this.containerElem = document.querySelector(`.menu-content-${this.props.id}`);
  }

  componentWillUnmount() {
    //document.removeEventListener('mousewheel', this.rePositionDirection);
    document.removeEventListener('click', this.outClick);
    document.removeEventListener("keydown", this.listenKeyboard);
    if(this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  listenKeyboard = (e) => {
    //close on Esc Key
    if (e.keyCode === 27) {
      this.props.onClose(e);
    }
  }

  outClick(evt) {
    if(this.containerElem && this.containerElem.contains(evt.target)) {
      return;
    }else{
      this.props.isMenuOpen && this.props.onClose(evt);
    }
  }

  rePositionDirection = () => {
    //if(!this.isMenuOpen) return;
    this.portalTopPos = null;
    requestAnimationFrame(() => this.setOpenDirection());
  }

  setOpenDirection() {
    let node = document.querySelector(`.menu-header-${this.props.id}`);
    let dropdownPortal = document.querySelector(`.menu-content-${this.props.id}`);
    //let portalPos = dropdownPortal.getBoundingClientRect();
    //keep the initial position, to place the dropdown correctly when doing filter
    this.portalTopPos = this.portalTopPos ? this.portalTopPos :
      parseInt(dropdownPortal.style.top.replace('px', ''), 0);
    let bodyPos = document.querySelector('body').getBoundingClientRect();
    let dropdownHeight = dropdownPortal.childNodes[0].getBoundingClientRect().height;
    if((this.portalTopPos + dropdownHeight) > bodyPos.height) {
      this.openDirection = 'top';
    }
    if(this.openDirection === 'top') {
      //dropdownPortal.style.top = `${this.portalTopPos - (dropdownHeight + selectBoxHeight) }px`;
      let dropdownTop = node.getBoundingClientRect().top;
      dropdownPortal.style.top = `${Math.max(dropdownTop - dropdownHeight, 0) }px`;
    }
  }

  render() {
    let { id, children, isMenuOpen, position, ...restProps } = this.props;
    return (
      <RelativePortal className={`menu-content-${id}`} top={position.top} left={position.left} {...restProps}>
        {
          this.props.children
        }
      </RelativePortal>
    );
  }
}
