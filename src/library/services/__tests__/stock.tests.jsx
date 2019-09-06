import { StockLoader } from "../stock";

describe("Stock", () => {

  let test_token = "test_token"

  beforeEach(jest.clearAllMocks);

  test("it should load each cellar", () => {
    let loader = StockLoader(test_token);

    loader.loadCellar = jest.fn().mockReturnValue("");
    loader.load([1, 2, 3], ["a", "b", "c"]);

    expect(loader.loadCellar).toHaveBeenCalledTimes(3);
    expect(loader.loadCellar).toHaveBeenCalledWith(1, ["a", "b", "c"]);
    expect(loader.loadCellar).toHaveBeenCalledWith(2, ["a", "b", "c"]);
    expect(loader.loadCellar).toHaveBeenCalledWith(3, ["a", "b", "c"]);
  });

  test("it should chunk and execute query by chunk", () => {
    let loader = StockLoader(test_token);

    loader.performRequest = jest.fn().mockReturnValue("");

    loader.chunk_size = 2;
    loader.loadCellar(1, ["a", "b", "c", "d", "e", "f", "g", "h"]);

    expect(loader.performRequest).toHaveBeenCalledTimes(4);
    expect(loader.performRequest).toHaveBeenCalledWith(1, ["a", "b"]);
    expect(loader.performRequest).toHaveBeenCalledWith(1, ["c", "d"]);
    expect(loader.performRequest).toHaveBeenCalledWith(1, ["e", "f"]);
    expect(loader.performRequest).toHaveBeenCalledWith(1, ["g", "h"]);
  });

  test("it should execute request to api", (done) => {
    let loader = StockLoader(test_token);

    global.fetch = jest.fn().mockResolvedValue({ json: () => { return { products: "test_response" } } });
    expect(loader.instances).toEqual(0);

    loader.done((cellar_id, products) => {
      // check if response is formatted
      expect(cellar_id).toEqual(1);
      expect(products).toEqual("test_response");
      done();
    });
    loader.performRequest(1, ["a", "b"]);
  });

});
