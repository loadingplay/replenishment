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

  set = (sku, value) => {
    this.data[sku] = value;
    localStorage.setItem('picker-data', JSON.stringify(this.data));
  }

  get = (sku) => {
    let number = parseInt(this.data[sku]);
    if (isNaN(number)) return 0;
    return number;
  }

}

const instance = new PickerStore();
Object.freeze(instance);

export default instance;
