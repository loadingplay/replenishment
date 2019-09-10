var Loader = function (access_token) {
  this.access_token = access_token;
  this.instances = 0;
  this.max_instances = 15;
  this.chunk_size = 10;
};

Loader.prototype.load = function (cellar_id_list, sku_list) {
  var loader = this;
  cellar_id_list.forEach(function (cellar) {
    loader.loadCellar(cellar, sku_list);
  });
  return this;
};

Loader.prototype.loadCellar = function (cellarid, sku_list) {
  var i, j, temparray;
  for (i = 0, j = sku_list.length; i < j; i += this.chunk_size) {
    temparray = sku_list.slice(i, i + this.chunk_size);
    // do whatever
    this.performRequest(cellarid, temparray);
  }
};

Loader.prototype.performRequest = function (cellarid, skus_chunk) {
  var loader = this;
  if (loader.instances > loader.max_instances) {
    setTimeout(function () {
      loader.performRequest(cellarid, skus_chunk);
    }, 100);
    return
  }
  this.instances += 1;
  fetch("https://apibodegas.loadingplay.com/v1/cellar/" + cellarid + "/product/?sku_list=" + skus_chunk.join(","),
  {
    headers: {
      "Authorization": "Bearer " + this.access_token
    }
  })
  .then((response) => response.json())
  .then((response) => {
    loader.instances -= 1;
    loader.callback(cellarid, response.products);
  });
};


Loader.prototype.done = function (callback) {
  this.callback = callback
};

export function StockLoader(access_token) {
  return new Loader(access_token);
}
