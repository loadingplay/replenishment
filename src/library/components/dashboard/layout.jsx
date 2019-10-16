import React, { Component } from 'react';
import PropTypes from "prop-types";
import "./layout.css";

export class DashboardLayout extends Component {

  static propTypes = {
    title: PropTypes.string,

    menuTitle: PropTypes.string,
    menu: PropTypes.object,

    tableTitle: PropTypes.string,
    table: PropTypes.object,
    tableControls: PropTypes.object,
    tableDownControls: PropTypes.object
  }

  render = () => {
    return (
      <>
        <div className="container">
          <div className="fixed-top bg-light">
            <div className="container" >
              <div className="row mt-2">
                <h3 className="col-auto">
                  {this.props.title}
                </h3>

                {/* Controls */}
                <section className="col">
                  <div className="row" >
                    {this.props.tableControls}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="row" >
            {/* Stores */}
            <div className="col-2" >
              <div className="subtitle">{this.props.menuTitle}</div>
              {this.props.menu}
            </div>

            {/* Inventory table */}
            <div className="col-10" >
              <div className="row" >
                <div className="subtitle col-6">
                  {this.props.tableTitle}
                </div>
              </div>

              {this.props.table}
              {this.props.tableDownControls}
            </div>
          </div>
        </div>
        {
          this.props.toastMessage !== "" ?
          <div className="toast-container" >
            <div className="toast-content" >
              {this.props.toastMessage}
            </div>
          </div>
          :
          null
        }
      </>
    )
  }
}
