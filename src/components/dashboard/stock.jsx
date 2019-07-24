import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import Paginator from 'react-hooks-paginator';
import './stores.css'
import authService from '../../services/authService';
import stockService from '../../services/stockService';

const stock = (props) => {
    const [fullData, fullDataSet] = useState([]);
    const [data, dataSet] = useState([]);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const pageLimit = 10;

    async function fetchGlobalData(){
      let token = authService.getCurrentToken();
      let allStocks = await stockService.getStockByCellarId(props.cellarId, token);
      fullDataSet(allStocks.data.products)
    }

    async function fetchPagedData() {
      let token = authService.getCurrentToken();
      console.log('Pagina Actual', currentPage)
      let stocksPaged = await stockService.getStockByCellarIdPaged(props.cellarId, token, currentPage);
      dataSet(stocksPaged.data.products);
    }
  
    useEffect(() => {
      fetchGlobalData()
      fetchPagedData();
    }, [props.cellarId])

    useEffect(() => {
      fetchPagedData();
      setCurrentData(data.slice(offset, offset + pageLimit));
    }, [offset, data]);
    
    console.log(data);
    
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
            {data.length !== 0 ? data.map((item, i) =>
              <tr key={i}>
                <th scope="row">{item.product_sku}</th>
                <td></td>
                <td>{item.balance_units}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ) : <tr><td>Buscando...</td></tr>}
          </tbody>
        </table>
        <Paginator
          totalRecords={fullData.length}
          pageLimit={4}
          setOffset={setOffset}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
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