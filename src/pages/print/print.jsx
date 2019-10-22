import React from 'react';
import { withDataLoader } from '../../library/components';

import './print.css';

export class Print extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate = (oldProps) => {
    if (oldProps.loadingMessage !== this.props.loadingMessage && this.props.loadingMessage === "") {
      this.convert2PDF({
        metadata: {
          numero: "-",
          fecha: new Date().toISOString(),
          usuario: "ADMIN",
        },
        transporte: {
          desde: {
            lugar: "BODEGA CENTRAL",
            usuario: "ADMIN"
          },
          hasta: {
            lugar: this.props.selectedCellar.name,
            usuario: "ADMIN"
          },
        },
        items: this.props.items
      });
    }
  }

  convert2PDF = (data) => {
    // Referencias al DOM con jQuery
    const $DOM = {
      metaNumero: document.getElementById("metadata-numero"),
      metaFecha: document.getElementById("metadata-fecha"),
      metaUsuario: document.getElementById("metadata-usuario"),
      desdeLugar: document.getElementById("desde-lugar"),
      desdeUsuario: document.getElementById("desde-usuario"),
      hastaLugar: document.getElementById("hasta-lugar"),
      hastaUsuario: document.getElementById("hasta-usuario"),
      items: document.getElementById("items")
    };

    // Rellenar los campos con la data recibida
    $DOM.metaNumero.innerHTML = data.metadata.numero;
    $DOM.metaFecha.innerHTML = data.metadata.fecha;
    $DOM.metaUsuario.innerHTML = data.metadata.usuario;
    $DOM.desdeLugar.innerHTML = data.transporte.desde.lugar;
    $DOM.desdeUsuario.innerHTML = data.transporte.desde.usuario;
    $DOM.hastaLugar.innerHTML = data.transporte.hasta.lugar;
    $DOM.hastaUsuario.innerHTML = data.transporte.hasta.usuario;

    // Añadir todos los items
    data.items.sort((a, b) => {
      if (a.codigo > b.codigo) return 1;
      if (a.codigo < b.codigo) return -1;
      return 0;
    }).forEach(item => {
      const template = `
        <tr>
            <td>${item.codigo}</td>
            <td>${item.insumo}</td>
            <td className="text-right">${item.existencia.casaMatriz}</td>
            <td className="text-right">${item.existencia.local}</td>
            <td className="expander">&nbsp;</td>
            <td className="text-right">${item.hecho}</td>
            <td className="text-right"><strong>${item.falta}</strong></td>
        </tr>
      `;
      $DOM.items.innerHTML += template;
    });
  }

  handleClick = () => {
    if (typeof window !== 'undefined' && window.print)
      window.print();
  }

  render() {
    return (
      <main>
        <button
          disabled={this.props.loadingMessage !== ""}
          onClick={this.handleClick}
          className="btn btn-success btn-block print-page-button" >
            { this.props.loadingMessage === "" ? "Imprimir":this.props.loadingMessage }
        </button>
        <header className="header">
          <div className="header__group">
            <h1>TRASPASO AUTOMÁTICO</h1>
          </div>
          <div className="header__group">
            <table className="header__meta">
              <tbody>
                <tr>
                  <th>
                    <strong>NÚMERO</strong>
                  </th>
                  <td className="text-right display-none">
                    <strong id="metadata-numero"></strong>
                  </td>
                </tr>
                <tr>
                  <th>
                    <strong>FECHA</strong>
                  </th>
                  <td id="metadata-fecha"></td>
                </tr>
                <tr>
                  <th>
                    <strong>USUARIO</strong>
                  </th>
                  <td>
                    <strong id="metadata-usuario"></strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="header__group">
            <div className="header__transportation">
              <div className="row">
                <div className="col-6">
                  <p>Desde</p>
                  <p id="desde-lugar"></p>
                  <p id="desde-usuario"></p>
                </div>
                <div className="col-6">
                  <p>Hasta</p>
                  <p id="hasta-lugar"></p>
                  <p id="hasta-usuario"></p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="items-wrapper">
          <table>
            <tbody id="items" >
              <tr>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
                <th colSpan="2" className="text-center" id="existencia" style={{ fontWeight: 400 }}>Existencia</th>
                <th className="expander">&nbsp;</th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
              </tr>
              <tr>
                <th>Código</th>
                <th>Insumo</th>
                <th className="text-right" id="casamatriz">Casa Matriz</th>
                <th className="text-right" id="local">Local</th>
                <th className="expander">&nbsp;</th>
                <th className="text-right">Hecho</th>
                <th className="text-right">Falta</th>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    )
  }
}


export default withDataLoader(Print);
