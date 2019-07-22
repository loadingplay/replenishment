import React, { useEffect, useState } from 'react'
import './stores.css'
import authService from '../../services/authService'
import cellarService from '../../services/cellarService'

const stores = (props) => {

    const [data, dataSet] = useState([]);
    const [cellarChecked, setCellarChecked] = useState(false);
    const [cellarId, setCellarId] = useState(0);
 
    async function fetchData(){
      let token = authService.getCurrentToken();
      let allCellars = await cellarService.getAllCellar(token);
      dataSet(allCellars); 
    }

    useEffect(() => {
      fetchData();
    }, [])


    function handleCheckCellar(event){
      const value = event.target.value;
      const checked = event.currentTarget.checked;
      setCellarChecked(checked)
      setCellarId(value)
      console.log(cellarId)
    }

    return (
      <section className="stores_wrapper">
        <table className="table table-hover table-borderless">
          <thead>
            <tr className="table-info">
              <th scope="col">tiendas</th>
            </tr>
          </thead>
          <tbody>
          {data.cellars ? data.cellars.map((item, i) => 
            <tr key={i}>
               <td><input type="checkbox" name="cellar" value={item.id} defaultChecked={cellarChecked} onChange={handleCheckCellar}></input> {item.name}</td>
            </tr>
          ): <tr><td>Buscando...</td></tr>}
          </tbody>
        </table>
      </section>
    )
}

export default stores;