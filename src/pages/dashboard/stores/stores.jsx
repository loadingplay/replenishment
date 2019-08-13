import React, { Component } from 'react'
import { StoreLoader } from '../../../library/services';
import './stores.css'

export class Stores extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cellars: null,
      selected_id: 0
    };
  }

  loadCellars = async (token) => {
    let store_api,
      json_data;

    store_api = new StoreLoader(token);
    json_data = await store_api.loadCellars();

    this.setState({
      "cellars": json_data.cellars
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.access_token !== "")
      this.loadCellars(newProps.access_token);
  }

  render() {
    let items = this.state.cellars ? this.state.cellars.map((item, index) => {
      return (
        <tr
          key={index}
          className={this.state.selected_id === item.id ? "stores_selected" : ""}
        >
          <td
            onClick={() => {
              this.setState({ selected_id: item.id });
              this.props.cellarSelected(item.id);
            }}
          >
            {item.name}
          </td>
        </tr>);
    }) : (<tr><td>Cargando...</td></tr>);

    return (
      <section className="stores_wrapper">
        <table className="table table-hover table-borderless table-sm">
          <thead>
            <tr className="table-info">
              <th scope="col">tiendas</th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </table>
      </section>
    )
  }
}
