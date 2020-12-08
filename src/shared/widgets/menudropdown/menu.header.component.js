import React from 'react';
import PropTypes from 'prop-types';

import { MenuConsumer } from './menu.context';

export function MenuHeader(props) {
  let { wrapper: Trigger, children, className, onClick, ...prop } = props;
  return (
    <MenuConsumer>
      {
        ({ toggleMenu, id, openOnHover, debouncedToggleMenu }) => {
          return (
            <Trigger {...prop}
              onClick={(evt) => { onClick(evt); !openOnHover && toggleMenu(evt);}}
              onMouseEnter={(evt) => { evt.persist(); openOnHover && debouncedToggleMenu(evt); } }
              //onMouseLeave={(evt) => { openOnHover && toggleMenu(evt); } }
              className={`${className} menu-header-${id}`}>
              {children}
            </Trigger>
          );
        }
      }
    </MenuConsumer>
  );
}

MenuHeader.displayName = 'MenuHeader';

MenuHeader.propTypes = {
  wrapper: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func
};

MenuHeader.defaultProps = {
  wrapper: 'div',
  onClick: () => {}
};
