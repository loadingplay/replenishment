export const StockLoader = window.StockLoader;

// fix loader for react compatibility
window.Loader.prototype.performRequest = function (cellarid, skus_chunk) {
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
