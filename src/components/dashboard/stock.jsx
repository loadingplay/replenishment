import React, { useEffect, useState } from 'react'
import './stores.css'
import authService from '../../services/authService';
import stockService from '../../services/stockService';

const stock = (props) => {
    const [data, dataSet] = useState([]);

    async function fetchData() {
      let token = authService.getCurrentToken();
      let allStocks = await stockService.getStockByCellarId(props.cellarId, token);
      dataSet(allStocks.data.products);
    }
  
    useEffect(() => {
      fetchData();
    }, [props.cellarId])
    
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
            {data ? data.map((item, i) =>
              <tr key={i}>
                <th scope="row">{item.product_sku}</th>
                <td></td>
                <td>{item.balance_units}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ) : <tr><td>Buscando...</td></tr>}
            <tr>
              <th scope="row">sku1</th>
              <td>producto 1</td>
              <td>10</td>
              <td>5</td>
              <td></td>
              <td>picker</td>
            </tr>
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