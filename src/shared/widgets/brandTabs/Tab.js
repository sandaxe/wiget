import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tab extends Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string,
    iconWidth: PropTypes.any,
    iconHeight: PropTypes.any
  };

  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  }

  render() {
    const {
      onClick,
      props: {
        activeTab,
        label
      }
    } = this;

    let className = 'brand_tab-list-item brand_tab-list-item-not-active';

    if (activeTab === label) {
      className = 'brand_tab-list-item brand_tab-list-active';
    }

    return (
      <li
        className={className}
        onClick={onClick}
      >
        <div className="tabsImages">
          <p>{label}</p>
        </div>
      </li>
    );
  }
}

export default Tab;
