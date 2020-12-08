import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./filter.css";
//import { PillComponent } from '../PillComponent/Pill';

export class FilterCardComponent extends Component {
  render() {
    let { filterName,
      filterImage,
      addDownArrow,
      filterisSelected,
      onClickFilter } = this.props;
    return (<div
      className={filterisSelected ?
        `${styles.filterCard} ${styles.selected}` : styles.filterCard}
      onClick={onClickFilter}>
      <img
        alt=""
        className={styles.filterImages}
        src={filterImage} width="36"/>
      <div style={{ display: "flex", alignContent: "center", alignItems: "center" }}>
        <p className={styles.filterText}>{filterName}</p>
        {addDownArrow && <p className={styles.arrowDown} />}
      </div>
    </div>);
  }
}


FilterCardComponent.propTypes = {
  filterName: PropTypes.string,
  filterImage: PropTypes.string,
  addDownArrow: PropTypes.bool,
  totalSelected: PropTypes.number,
  totalText: PropTypes.string,
  filterisSelected: PropTypes.bool,
  onClickFilter: PropTypes.func,
  uniqueColor: PropTypes.string
};
