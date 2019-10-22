class _PickerStore {
  constructor() {
    if(!_PickerStore.instance) {
      let storage_data;

      try {
        if (typeof window !== 'undefined' && window.localStorage)
          storage_data = JSON.parse(localStorage.getItem('picker-data'));
      } catch(ex) {
        console.log(ex);
      }

      this.data = storage_data ? storage_data:{};
      _PickerStore.instance = this;
    }

    return _PickerStore.instance;
  }

  set = (cellar_id, sku, value, hq_inventory, current_inventory, suggested) => {
    if (!this.data || !(cellar_id in this.data) || this.data.cellar_id === "") {
      this.data[cellar_id] = {};
    }
    if (value === 0)
      delete this.data[cellar_id][sku];
    else
      this.data[cellar_id][sku] = {
        value,
        hq_inventory,
        current_inventory,
        suggested
      };

    if (typeof window !== 'undefined' && window.localStorage)
      localStorage.setItem('picker-data', JSON.stringify(this.data));
  }

  get = (cellar_id, sku) => {
    if (!this.data || !(cellar_id in this.data)) return 0;

    if (sku === undefined) return this.data[cellar_id];
    if (this.data[cellar_id][sku] === undefined) return 0;

    let number = parseInt(this.data[cellar_id][sku].value);
    if (isNaN(number)) return 0;

    return number;
  }

  clear = (cellar_id) => {
    if (!this.data || !(cellar_id in this.data)) return;
    this.data[cellar_id] = undefined;
    delete this.data[cellar_id];
    if (typeof window !== 'undefined' && window.localStorage)
      localStorage.setItem('picker-data', JSON.stringify(this.data));
  }

  getAll = () => {
    return this.data;
  }

}

export const PickerStore = new _PickerStore();
