import React, { Component } from 'react'
import PropTypes from "prop-types";
import { StoreLoader } from '../../services';
import './stores.css'

const LoadStoreStatus = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded"
}

export class Stores extends Component {

  static propTypes = {
    onHQCellarLoaded: PropTypes.func,
    cellarSelected: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      cellars: null,
      selected_id: 0
    };

    this.store_api = new StoreLoader("");
    this.load_status = LoadStoreStatus.IDLE;
  }

  loadCellars = async (token) => {
    let json_data;

    this.load_status = LoadStoreStatus.LOADING

    this.store_api.access_token = token

    try {
      json_data = await this.store_api.loadCellars();

      // trigger hq store event
      json_data.cellars.map((item) => {
        if (item.for_sale) {
          this.store_api.setHQCellar(item);
          this.props.onHQCellarLoaded(item.id);
        }
        return 0;
      });

      this.setState({
        "cellars": json_data.cellars
      }, () => {
        this.load_status = LoadStoreStatus.LOADED;
      });
    } catch (ex) {
      this.load_status = LoadStoreStatus.IDLE;
    }
  }

  saveSelectedCellar = (cellar) => {
    this.store_api.setSelectedCellar(cellar);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.accessToken !== "" && this.load_status === LoadStoreStatus.IDLE)
      this.loadCellars(newProps.accessToken);
  }

  render() {
    let items = this.state.cellars ? this.state.cellars.map((item, index) => {
      return (
        <tr
          key={index}
          className={this.state.selected_id === item.id ? "stores_selected" : ""}
        >
          <td
            onClick={() => {
              this.setState({ selected_id: item.id });
              this.saveSelectedCellar(item);
              this.props.cellarSelected(item.id, item.name);
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
