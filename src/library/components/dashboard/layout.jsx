import React, { Component } from 'react';
import PropTypes from "prop-types";

import { LogoutButton } from '../../components';

export class DashboardLayout extends Component {

  static propTypes = {
    title: PropTypes.string,

    menuTitle: PropTypes.string,
    menu: PropTypes.object,

    tableTitle: PropTypes.string,
    table: PropTypes.object,
    tableControls: PropTypes.object
  }

  render = () => {
    return (
      <div className="container dashboard_wrapper">
        <div className="dashboard_elements row">
          <h3 className="dashboard_title col-12">
            {this.props.title}
          </h3>

          {/* Stores */}
          <div className="col-2" >
            <div className="subtitle">{this.props.menuTitle}</div>
            {this.props.menu}
          </div>

          {/* Inventory table */}
          <div className="col-10 row" >
            <div className="subtitle col-6">
              {this.props.tableTitle}
            </div>
            <div className="col-6">
              <LogoutButton></LogoutButton>
            </div>
            {this.props.table}

            {/* Controls */}
            <section className="controls col-12 row">
              {this.props.tableControls}
            </section>
          </div>
        </div>
      </div>
    )
  }
}
