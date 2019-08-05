import React, { Component } from 'react'

export default class stores extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cellars: null,
      selected_id: 0
    };
  }

  loadCellars = async (token) => {
    let response, json_data;

    response = await fetch("https://apibodegas.loadingplay.com/v1/cellar", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    json_data = await response.json();
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
        <table className="table table-hover table-borderless">
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
