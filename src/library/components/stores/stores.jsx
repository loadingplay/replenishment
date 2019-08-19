import React, { Component } from 'react'
import { StoreLoader } from '../../services';
import './stores.css'

export class Stores extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cellars: null,
      selected_id: 0
    };

    this.store_api = new StoreLoader("");
  }

  loadCellars = async (token) => {
    let json_data;

    this.store_api.access_token = token
    json_data = await this.store_api.loadCellars();

    this.setState({
      "cellars": json_data.cellars
    });
  }

  saveSelectedCellar = (cellar) => {
    this.store_api.setSelectedCellar(cellar);
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
              this.saveSelectedCellar(item);
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
