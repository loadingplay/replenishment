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
    const pageLimit = 10;

    async function fetchPagedData() {
      let token = authService.getCurrentToken();
      console.log('Pagina Actual', currentPage)
      console.log('Id actual', props.cellarId)
      let stocksPaged = await stockService.getSuggestedProducts(props.cellarId, token);
      console.log(stocksPaged);
      dataSet(stocksPaged.data.replenishments);
    }
  
    useEffect(() => {
      fetchPagedData();
    }, [props.cellarId])

    useEffect(() => {
      setCurrentData(data ? data.slice(offset, offset + pageLimit) : 0);
    }, [offset, data]);
    
    console.log(currentData);
    
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
                <td></td>
                <td></td>
                <td>{item.suggested ? 'Sí' : 'No'}</td>
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