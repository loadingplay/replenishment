import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import Paginator from 'react-hooks-paginator';
import './stores.css'
import authService from '../../services/authService';
import stockService from '../../services/stockService';

const stock = (props) => {
  const [data, dataSet] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const token = authService.getCurrentToken();
  const pageLimit = 10;

  async function fetchSuggestedData() {
    let stocksSuggested = await stockService.getSuggestedProducts(props.cellarId, token);
    let data = stocksSuggested.data.replenishments
    data ? data.sort((a, b) => (a.suggested > b.suggested) ? 1 : -1) : '';
    dataSet(data);
  }

  async function fetchStockData(){
    let getStock = await stockService.getStockByCellarId(props.cellarId, token)
    let dataProducts = getStock.data.products;
    dataProducts ? dataProducts.map((item, i) => {
      currentData ? currentData.map((e, i) => {
        if(e.sku === item.product_sku){
          e.balance_units = item.balance_units
          e.in_stock = item.in_stock
        }
        return e;
      }) : '';
      return currentData;
    }) : '';
  }

  useEffect(() => {
    fetchSuggestedData();
  }, [props.cellarId])

  useEffect(() => {
    fetchStockData();
  }, [props.cellarId])

  useEffect(() => {
    setCurrentData(data ? data.slice(offset, offset + pageLimit) : []);
    fetchStockData();
  }, [offset, data, props.cellarId]);

  async function handleSearch(evt) {
    let sku = evt.target.value;
    let currentInventory = await stockService.getCurrentInventory(props.cellarId, token, sku);
    console.log(currentInventory);
  }


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
          {currentData ? currentData.map((item, i) =>
            <tr key={i}>
              <th scope="row">{item.sku}</th>
              <td>{item.site_name}</td>
              <td>{item.in_stock ? 'Sí' : 'No'}</td>
              <td>{item.balance_units ? item.balance_units : 0}</td>
              <td>{item.suggested}</td>
              <td></td>
            </tr>
          ) : <tr><td>Buscando...</td></tr>}
        </tbody>
      </table>
      <Paginator
        totalRecords={data ? data.length : 1}
        pageLimit={4}
        pageNeighbours={1}
        setOffset={setOffset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <section className="search_actions">
        <div>
          <input type="text" placeholder="ingrese sku" onChange={handleSearch} />
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
          <div>
            <button type="button" className="btn btn-danger" onClick={authService.logout}>
              cerrar sesión
              </button>
          </div>
        </div>
      </section>
    </section>
  )
}

export default stock;