import React from 'react';
import { StoreLoader, PickerStore, StockLoader } from '../../library/services';

export function withDataLoader(WrappedComponent) {
    return class DataLoader extends React.Component {
      constructor(props) {
        super(props);

        this.access_token = "";
        if (typeof window !== 'undefined' && window.localStorage)
            this.access_token = window.localStorage.getItem("access_token");
        this.picker_data = [];
        this.selected_cellar = {};
        this.hq_cellar = {};
        this.picker_items = [];
        this.store_api = new StoreLoader(this.access_token);
        this.state = { api_items: [], loading_message: "Cargando..." };
        this.getDataFromPicker();
      };

      componentDidMount = async () => {
        await this.getDataFromAPI();
        await this.populateFromKardex();
        this.populateWithPicker();
      }

      getDataFromPicker = () => {
        // get data from picker
        this.picker_data = PickerStore.getAll();
        this.selected_cellar = this.store_api.getSelectedCellar();
        this.hq_cellar = this.store_api.getHQCellar();
        this.picker_items = this.picker_data[this.selected_cellar.id] === undefined ?
          []:this.picker_data[this.selected_cellar.id];
      }

      getDataFromAPI = async () => {
        // get data from API
        this.setState({ loading_message: "Cargando todos los productos sugeridos..." });
        let page = 1,
          api_aux = await this.store_api.searchProducts(page, this.selected_cellar.id, "");

        while (api_aux.status === "success" && api_aux.replenishments.length > 0)
        {
          this.state.api_items = this.state.api_items.concat(api_aux.replenishments.map((item) => {
            return {
              sku: item.sku,
              codigo: item.barcode,
              insumo: item.product_name,
              existencia: {
                casaMatriz: null,
                local: null
              },
              hecho: 0,
              falta: item.suggested
            }
          }));
          api_aux = await this.store_api.searchProducts(++page, this.selected_cellar.id, "");
        }
      }

      populateFromKardex = async () => {
        // populate data from kardex
        let cellars,
          skus,
          stock_loader = StockLoader(this.access_token),
          promises,
          processed_promises = 0,
          done_percentage = 0;

        cellars = this.selected_cellar.id === this.hq_cellar.id ?
          [this.selected_cellar.id] : [this.selected_cellar.id, this.hq_cellar.id]
        skus = this.state.api_items.map((item) => {
            return item.sku;
          });

        stock_loader.max_instances = 1000;
        promises = stock_loader
          .load(cellars, skus)
          .done((loaded_cellar, products) => {
            done_percentage = Math.ceil(++processed_promises * 100 / promises.length);
            this.setState({ loading_message: `Cargando inventario actual ${done_percentage}% ...` });

            products.forEach((y_item) => {
              this.state.api_items.find((x_item) => {
                if (y_item.product_sku !== x_item.sku) return false;

                if (this.hq_cellar.id === loaded_cellar)
                  x_item.existencia.casaMatriz = y_item.balance_units;
                if (this.selected_cellar.id === loaded_cellar)
                  x_item.existencia.local = y_item.balance_units;

                return true;
              });
            });
          });

        await Promise.all(promises);
      }

      populateWithPicker = () => {
        // populate with picker
        this.state.api_items.forEach((item) => {
          if (!this.picker_items[item.sku]) return;

          item.hecho = this.picker_items[item.sku].value;
          item.falta = this.picker_items[item.sku].suggested - this.picker_items[item.sku].value
        });

        // update api items
        this.setState({ api_items: this.state.api_items, loading_message: "" });
      }

      render = () => {
        return <WrappedComponent
          {...this.props}
          items={this.state.api_items}
          loadingMessage={this.state.loading_message}
          selectedCellar={this.selected_cellar}
        />
      }
    }
  }
