class PickerStore {
  constructor() {
    if(!PickerStore.instance) {
      let storage_data;

      try {
        storage_data = JSON.parse(localStorage.getItem('picker-data'));
      } catch(ex) {
        console.log(ex);
      }

      this.data = storage_data ? storage_data:{};
      PickerStore.instance = this;
    }

    return PickerStore.instance;
  }

  set = (cellar_id, sku, value) => {
    if (!this.data || !this.data.hasOwnProperty(cellar_id)) {
      this.data[cellar_id] = {};
    }
    this.data[cellar_id][sku] = value;
    localStorage.setItem('picker-data', JSON.stringify(this.data));
  }

  get = (cellar_id, sku) => {
    if (!this.data || !this.data.hasOwnProperty(cellar_id)) return 0;

    let number = parseInt(this.data[cellar_id][sku]);
    if (isNaN(number)) return 0;
    return number;
  }

}

const instance = new PickerStore();
Object.freeze(instance);

export default instance;
