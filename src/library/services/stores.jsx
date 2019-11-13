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

  resetSuggested = async (cellar_id) => {
    let response, json_data;
    response = await fetch(
      `https://replenishments.loadingplay.com/replenishment/reset`,
      {
        "headers" : {
          "Authorization": `Bearer ${this.access_token}`
        },
        "method": "PUT",
        "body": JSON.stringify({ cellar_id })
      }
    )

    json_data = await response.json();
    return json_data;
  }

  searchProducts = async (page, cellar_id, search) => {
    let response, json_data;

    response = await fetch(
      `https://replenishments.loadingplay.com/replenishment?items=100&page=${page}&cellar_id=${cellar_id}&search_word=${search}`,
      {
        "headers": {
          "Authorization": `Bearer ${this.access_token}`
        }
      });

    json_data = await response.json();
    return json_data;
  }

  findProduct = async (cellar_id, filter) => {
    let response, json_data;

    response = await fetch(
      `https://replenishments.loadingplay.com/replenishment/${cellar_id}/${filter}`,
      {
        "headers": {
          "Authorization": `Bearer ${this.access_token}`
        }
      });

    json_data = await response.json();

    // mimic normal response
    json_data.metadata = { count: 1 };
    if (json_data.replenishment && json_data.replenishment.length !== 0) {
      json_data.replenishments = [json_data.replenishment];
    } else {
      json_data.replenishments = [];
    }
    delete json_data.replenishment;

    return json_data;
  }

  loadProducts = async (page, cellar_id, sku_filter_or_search, search_type) => {
    if (sku_filter_or_search === '' || search_type === 'search')
      return await this.searchProducts(page, cellar_id, sku_filter_or_search);
    else
      return await this.findProduct(cellar_id, sku_filter_or_search);
  }

  setHQCellar = (cellar) => {
    if (typeof window !== 'undefined' && window.localStorage)
      localStorage.setItem("hq-cellar", JSON.stringify(cellar));
  }

  getHQCellar = () => {
    if (typeof window !== 'undefined' && window.localStorage)
      return JSON.parse(localStorage.getItem("hq-cellar"));
    return {};
  }

  setSelectedCellar = (cellar) => {
    if (typeof window !== 'undefined' && window.localStorage)
      localStorage.setItem("selected-cellar", JSON.stringify(cellar));
  }

  getSelectedCellar = () => {
    if (typeof window !== 'undefined' && window.localStorage)
      return JSON.parse(localStorage.getItem("selected-cellar"));
    return {};
  }
}
