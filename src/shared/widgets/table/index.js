import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'rc-table';
import 'rc-table/assets/index.css';
import styles from './table.css';
export class TableComponent extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    data: PropTypes.array,
    columns: PropTypes.array,
    onRowClick: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick(record, index) {
    this.props.onRowClick && this.props.onRowClick(record, index);
  }

  render() {
    return (
      <Table className={styles.table} columns={this.props.columns}
        data={this.props.data}
        onRow={(record, index) => ({
          onClick: this.onRowClick.bind(null, record, index)
        })}/>
    );
  }
}
