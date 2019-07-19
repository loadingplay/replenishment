import React, { useEffect, useState } from 'react'
import './stores.css'
import { Link } from 'gatsby'
import authService from '../../services/authService'
import cellarService from '../../services/cellarService'

const stores = (props) => {

    const [data, dataSet] = useState([]);
    const [addCellarIsClicked, setAddCellarIsClicked] = useState(false);
    const [deleteCellarIsClicked, setDeleteCellarIsClicked] = useState(false);
    const [cellarChecked, setCellarChecked] = useState(false);
    const [cellarId, setCellarId] = useState(0);
 
    async function fetchData(){
      let token = authService.getCurrentToken();
      let allCellars = await cellarService.getAllCellar(token);
      console.log(allCellars)
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
    }

    async function handleAddCellarClick(){
      setAddCellarIsClicked(true)
      console.log(addCellarIsClicked)
      let objPost = {
        name: 'Test Post Nuevo',
        description: 'Description Nueva'
      }
      let token = authService.getCurrentToken();
      await cellarService.postCellar(objPost, token)
      fetchData();
    }

    async function handleDeleteCellarClick(){
      setDeleteCellarIsClicked(true)
      let token = authService.getCurrentToken();
      await cellarService.deleteCellar(cellarId, token);
      fetchData();
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
               <td><input type="checkbox" name="cellar" value={item.id} checked={cellarChecked} onChange={handleCheckCellar}></input> {item.name}</td>
            </tr>
          ): <tr><td>Buscando...</td></tr>}
          </tbody>
        </table>
        <div>
          <button type="button" className="btn btn-success stores_wrapper_button" onClick={handleAddCellarClick}>
            Añadir Bodega
          </button> 
          <button type="button" disabled={cellarId == 0} className="btn btn-danger stores_wrapper_button" onClick={handleDeleteCellarClick}>
            Eliminar Bodega
          </button>
        </div>
      </section>
    )
}

export default stores;