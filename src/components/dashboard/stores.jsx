import React, { useEffect, useState } from 'react'
import './stores.css'
import authService from '../../services/authService'
import cellarService from '../../services/cellarService'

const stores = (props) => {

  const [data, dataSet] = useState([]);
  
  async function fetchData() {
    let token = authService.getCurrentToken();
    let allCellars = await cellarService.getAllCellar(token);
    dataSet(allCellars);
  }

  useEffect(() => {
    fetchData();
  }, [])


  function handleClickCellar(value) {
    props.setCellarId(value)
  }

  return (
    <section className="stores_wrapper" cellar={props.cellarId}>
      <table className="table table-hover table-borderless">
        <thead>
          <tr className="table-info">
            <th scope="col">tiendas</th>
          </tr>
        </thead>
        <tbody>
          {data.cellars ? data.cellars.map((item, i) =>
            <tr key={i}>
              <td><input type="button" name="cellar" className="btn btn-default" value={item.name} onClick={() => handleClickCellar(item.id)}/></td>
            </tr>
          ) : <tr><td>Buscando...</td></tr>}
        </tbody>
      </table>
    </section>
  )
}

export default stores;