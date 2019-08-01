import React, { Component } from 'react'
import './stores.css'

const StockLoader = window.StockLoader;

// fix loader for react compatibility
window.Loader.prototype.performRequest = function (cellarid, skus_chunk) {
  var loader = this;
  if (loader.instances > loader.max_instances) {
    setTimeout(function () {
      loader.performRequest(cellarid, skus_chunk);
    }, 100);
    return
  }
  this.instances += 1;
  fetch("https://apibodegas.loadingplay.com/v1/cellar/" + cellarid + "/product/?sku_list=" + skus_chunk.join(","),
  {
    headers: {
      "Authorization": "Bearer " + this.access_token
    }
  })
  .then((response) => response.json())
  .then((response) => {
    loader.instances -= 1;
    loader.callback(cellarid, response.products);
  });
};

// implement stock class
export default class stock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  loadInventory = async (cellar_id) => {
    let response, json_data;

    response = await fetch(
      `https://replenishments.loadingplay.com/replenishment?cellar_id=${cellar_id}`,
      {
        "headers": {
          "Authorization": `Bearer ${this.props.access_token}`
        }
      });
    json_data = await response.json();
    this.setState({
      products: json_data.replenishments
    });

    this.loadStoreInventory(cellar_id, json_data.replenishments);
  }

  loadStoreInventory = (cellar_id, products) => {
    let skus = products.map((item) => {
      return item.sku;
    });
    StockLoader(this.props.access_token)
    .load([cellar_id], skus)
    .done((cellar_id, products) => {
      let new_products = this.state.products.map((item, index) => {
        let inventory = products.find((element) => {
          return item.sku === element.product_sku
        });
        if (item.current_inventory === undefined) {
          item.current_inventory = inventory !== undefined ? inventory.balance_units:undefined;
        }
        return item;
      });

      this.setState({
        products: new_products
      })
    });

  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.selected_cellar !== 0) {
      this.loadInventory(newProps.selected_cellar);
    }
  }

  render() {
    return (
      <section className="stores_wrapper">
        <table className="table table-hover table-borderless">
          <thead>
            <tr className="table-info">
              <th scope="col">sku</th>
              <th scope="col">nombre producto</th>
              <th scope="col">stock en bodega</th>
              <th scope="col">stock en tienda</th>
              <th scope="col">sugerido</th>
              <th scope="col">picker</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.products.map((item, index) => {
                return (
                  <tr key={index} >
                    <th scope="row">{item.sku}</th>
                    <td></td>
                    <td></td>
                    <td>
                      {
                        item.current_inventory === undefined ?
                        'cargando...':item.current_inventory
                      }
                    </td>
                    <td>{item.suggested}</td>
                    <td></td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        <section className="search_actions">
          <div>
            <input type="text" placeholder="ingrese sku" />
          </div>
          <div className="list_btn">
            <div>
              <button type="button" className="btn btn-success">
                imprimir
              </button>
            </div>
            <div>
              <button type="button" className="btn btn-primary">
                generar guia de despacho
              </button>
            </div>
          </div>
        </section>
      </section>
    )
  }
}
