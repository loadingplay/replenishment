export default class StoreLoader {
  constructor(access_token) {
    this.access_token = access_token;
  }

  loadStoreList = async (page, cellar_id) => {
    let response, json_data;

    response = await fetch(
      `https://replenishments.loadingplay.com/replenishment?items=100&page=${page}&cellar_id=${cellar_id}`,
      {
        "headers": {
          "Authorization": `Bearer ${this.access_token}`
        }
      });

    json_data = await response.json();
    return json_data;
  }
}
