import React, { Component } from 'react'
import ReactPaginate from 'react-paginate';
import StockLoader from '../services/stock';
import StoreLoader from '../services/stores';
import "./stock.css";

// implement stock class
export default class stock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: null,
      error_message: ""
    };
  }

  handleNewStatus = (json_data) => {
    // handle status
    if (json_data.status === "error") {
      this.setState({
        error_message: json_data.message
      });
    }
    else
    {
      this.setState({
        products: json_data.replenishments,
        error_message: ""
      });
    }
  }

  loadInventory = async (cellar_id, page) => {
    let store_loader,
      json_data;

    // reset status
    this.setState({ products: null });
    store_loader = new StoreLoader(this.props.access_token);
    json_data = await store_loader.loadStoreList(page, cellar_id);

    this.handleNewStatus(json_data);

    // load current inventory
    if (json_data.replenishments)
      this.loadStoreInventory(cellar_id, json_data.replenishments);
  }

  loadStoreInventory = (cellar_id, products) => {
    // early termination
    if (products === undefined) return;

    let skus = products.map((item) => {
      return item.sku;
    });

    StockLoader(this.props.access_token)
    .load([cellar_id], skus)
    .done((cellar_id, products) => {
      if (!this.state.products) return;
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
      });
    });

  }

  handlePageClick = (e) => {
    this.loadInventory(this.props.selected_cellar, e.selected + 1);
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.selected_cellar !== 0) {
      this.loadInventory(newProps.selected_cellar, 1);
    }
  }

  renderProductList = () => {
    let products;

    if (!this.props.selected_cellar)
    {
      products = (<tr><td colSpan="6" className="stock-message" >Seleccione una bodega</td></tr>);
    }
    else if (this.state.error_message !== "")
    {
      products = (<tr><td colSpan="6" className="stock-message" >{this.state.error_message}</td></tr>);
    }
    else if (!this.state.products)
    {
      products = (<tr><td colSpan="6" className="stock-message" >Cargando...</td></tr>);
    }
    else if (this.state.products.length === 0)
    {
      products = (<tr><td colSpan="6" >No hay productos sugeridos en esta tienda</td></tr>);
    }
    else
    {
      products = this.state.products.map((item, index) => {
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
      });
    }

    return products;
  }

  render() {

    return (
      <section className="stores_wrapper col-12">
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
            { this.renderProductList() }
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={'anterior'}
          nextLabel={'siguiente'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          activeClassName={'active'}
        />
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
