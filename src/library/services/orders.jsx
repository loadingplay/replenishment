
export class Orders {

  static API_URL = "https://apibodegas.loadingplay.com";

  constructor(access_token) {
    this.access_token = access_token;
  }

  create = async (post_data) => {
    let response,
      json_data;

    response = await fetch(
      Orders.API_URL + "/v1/order?",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + this.access_token,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: this._convertToQueryString(post_data)
      }
    );

    json_data = await response.json();
    return json_data
  }

  update = async (order_id, put_data) => {
    let response,
      json_data;

    response = await fetch(
      Orders.API_URL + "/v1/order/" + order_id,
      {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + this.access_token,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: this._convertToQueryString(put_data)
      }
    );

    json_data = await response.json();
    return json_data;
  }

  get = async (order_id) => {
    let response,
      json_data;

    response = await fetch(
      Orders.API_URL + '/v1/order/' + order_id,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.access_token}`
        }
      }
    );

    json_data = await response.json();
    return json_data
  }

  _convertToQueryString = (json_data) => {
    return Object.keys(json_data).map(key => key + '=' + json_data[key]).join('&')
  }
}
