import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tab from './Tab';

class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    switchTab: PropTypes.string.isRequired,
    onChangeTab: PropTypes.func.isRequired
  }
  render() {
    const {
      children,
      switchTab,
      onChangeTab
    } = this.props;
    return (
      <div className="brand_tabs">
        <ol className="brand_tab-list">
          {children.map((child) => {
            const { label } = child.props;

            return (
              <Tab
                activeTab={switchTab}
                key={label}
                label={label}
                onClick={onChangeTab}
              />
            );
          })}
        </ol>
        <div className="brand_tab-content">
          {children.map((child) => {
            if (child.props.label !== switchTab) return undefined;
            return child.props.children;
          })}
        </div>
      </div>
    );
  }
}

export default Tabs;
