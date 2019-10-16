export class StoreLoader {
  constructor(access_token) {
    this.access_token = access_token;
  }

  loadCellars = async () => {
    let response,
      json_data;

    response = await fetch("https://apibodegas.loadingplay.com/v1/cellar", {
      headers: {
        "Authorization": `Bearer ${this.access_token}`
      }
    });
    json_data = await response.json();
    return json_data;
  }

  loadProducts = async (page, cellar_id, sku_filter) => {
    let response, json_data;

    response = await fetch(
      `https://replenishments.loadingplay.com/replenishment?items=100&page=${page}&cellar_id=${cellar_id}&search_word=${sku_filter}`,
      {
        "headers": {
          "Authorization": `Bearer ${this.access_token}`
        }
      });

    json_data = await response.json();
    return json_data;
  }

  setSelectedCellar = (cellar) => {
    localStorage.setItem("selected-cellar", JSON.stringify(cellar));
  }

  getSelectedCellar = () => {
    return JSON.parse(localStorage.getItem("selected-cellar"));
  }
}
