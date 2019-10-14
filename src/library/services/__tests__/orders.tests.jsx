import { Orders } from "../orders";

describe("Orders", () => {

  let test_token = "test_token";

  beforeEach(jest.clearAllMocks);

  test("it should asign right access token", () => {
    let orders = new Orders(test_token);
    expect(orders.access_token).toEqual(test_token)
  });

  test("it should create an order in api", async () => {
    let
      response,
      orders,
      test_response;

    test_response = { "response": "test_response" }
    global.fetch = jest.fn().mockResolvedValue({ "json": () => { return test_response } });

    orders = new Orders(test_token);
    response = await orders.create({ "data": "test_data" });

    expect(response).toEqual(test_response);
    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith(
      "https://apibodegas.loadingplay.com/v1/order?",
      {
        "body": "data=test_data",
        "headers": {
          "Authorization": "Bearer test_token",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "method": "POST"
      }
    );
  });

  test("it should update an order status in api", async () => {
    let
      response,
      orders,
      test_response;

    test_response = { "response": "test_response" }
    global.fetch = jest.fn().mockResolvedValue({ "json": () => { return test_response } });

    orders = new Orders(test_token);
    response = await orders.update(1, { "data": "test_data" });

    expect(response).toEqual(test_response);
    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith(
      "https://apibodegas.loadingplay.com/v1/order/1",
      {
        "body": "data=test_data",
        "headers": {
          "Authorization": "Bearer test_token",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "method": "PUT"
      }
    );
  });

  test("it should be able to convert json to query string", () => {
    let orders = new Orders(test_token);
    expect(orders._convertToQueryString({})).toEqual("");
    expect(orders._convertToQueryString({ "test": "test" })).toEqual("test=test");
    expect(orders._convertToQueryString({ "test1": "aaa", "test2": "bbb" })).toEqual("test1=aaa&test2=bbb");
  });

  test("it should get order from API", async () => {
    let
      json_data,
      orders = new Orders("test_token");

    global.fetch = jest.fn().mockResolvedValue({ json: () => {return { "test": "test" } }});
    json_data = await orders.get(100);

    expect(json_data).toEqual({ "test": "test" });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://apibodegas.loadingplay.com/v1/order/100",
      {"headers": {"Authorization": "Bearer test_token"}, "method": "GET"}
    );
  });

});
