import { StoreLoader } from "../stores";

describe("StoreLoader", () => {

  let test_token = "test_token";

  beforeEach(jest.clearAllMocks);

  test("it should load cellar from api", async () => {
    let store_loader,
      cellars;

    global.fetch = jest.fn().mockResolvedValue({
      json: () => {
        return { test_data: "test_data" };
      }
    });

    store_loader = new StoreLoader(test_token);
    cellars = await store_loader.loadCellars();

    expect(cellars).toEqual({ test_data: 'test_data' });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://apibodegas.loadingplay.com/v1/cellar",
      {
        "headers": {
          "Authorization": "Bearer test_token"
        }
      }
    );
  });

  test("it should load products from replenishments api", async () => {
    let store_loader,
      products;

    global.fetch = jest.fn().mockResolvedValue({
      json: () => {
        return { test_data: "test_data" };
      }
    });

    store_loader = new StoreLoader(test_token);
    products = await store_loader.loadProducts(1, 2, "test-sku");

    expect(products).toEqual({ test_data: 'test_data' });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://replenishments.loadingplay.com/replenishment?items=100&page=1&cellar_id=2&search_word=test-sku",
      {
        "headers": {
          "Authorization": "Bearer test_token"
        }
      }
    );
  });

  test("it should set and load selected cellar", () => {
    let store_loader,
      json_data;

    store_loader = new StoreLoader(test_token);
    json_data = { test_data: 'test_data' };

    store_loader.setSelectedCellar(json_data);
    expect(localStorage.getItem('selected-cellar')).toEqual(JSON.stringify(json_data));
    expect(store_loader.getSelectedCellar()).toEqual(json_data);
  });

});
