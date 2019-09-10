import { PickerStore } from "../picker";

describe("PickerStore", () => {

  let first_sku, second_sku;

  first_sku = {
    "value": 10,
    "hq_inventory": 5,
    "current_inventory": 3,
    "suggested": 20
  };
  second_sku = {
    "value": 5,
    "hq_inventory": 10,
    "current_inventory": 30,
    "suggested": 10
  };

  beforeEach(() => {
    PickerStore.clear(1);
    jest.clearAllMocks();
  });

  test("it should set a item in local storage", () => {

    // send first sku
    PickerStore.set(1, "first_sku", 10, 5, 3, 20);
    expect(JSON.parse(localStorage.getItem('picker-data'))).toEqual({
      "1": { first_sku }
    });

    // send second sku
    PickerStore.set(1, "second_sku", 5, 10, 30, 10);
    expect(JSON.parse(localStorage.getItem('picker-data'))).toEqual({
      "1": { first_sku, second_sku }
    });
  });

  test("it should read from local storage", () => {

    PickerStore.set(1, "first_sku", 10, 5, 3, 20);
    PickerStore.set(1, "second_sku", 5, 10, 30, 10);

    expect(PickerStore.get(1, "first_sku")).toEqual(10);
    expect(PickerStore.get(1, "second_sku")).toEqual(5);
  });

  test("it should clear all elements in cellar", () => {
    PickerStore.set(1, "first_sku", 10, 5, 3, 20);
    PickerStore.set(1, "second_sku", 5, 10, 30, 10);

    expect(JSON.parse(localStorage.getItem('picker-data'))).toEqual({
      "1": { first_sku, second_sku }
    });
    PickerStore.clear(1);

    expect(JSON.parse(localStorage.getItem('picker-data'))).toEqual({});
  });

  test("it should get all data", () => {
    PickerStore.set(1, "first_sku", 10, 5, 3, 20);
    PickerStore.set(1, "second_sku", 5, 10, 30, 10);

    expect(PickerStore.getAll()).toEqual({
      "1": { first_sku, second_sku }
    });
  });
});
