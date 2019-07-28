export default {
    getStockByCellarId(id, token){
        token = token.replace(/^"(.*)"$/, '$1');
        id = parseInt(id);
        return fetch(`https://apibodegas.loadingplay.com/v1/cellar/${id}/products`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + token,
            }
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            let objResponse = {
                cellarId: id,
                data: responseData
            }
            return objResponse;
        });
    },
    getStockByCellarIdPaged(id, token, page){
        token = token.replace(/^"(.*)"$/, '$1');
        id = parseInt(id);
        return fetch(`https://apibodegas.loadingplay.com/v1/cellar/${id}/products?page=${page}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + token,
            }
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            let objResponse = {
                cellarId: id,
                data: responseData
            }
            return objResponse;
        });
    },
    getSuggestedProducts(id, token) {
        token = token.replace(/^"(.*)"$/, '$1');
        id = parseInt(id);
        return fetch(`https://replenishments.loadingplay.com/replenishment?cellar_id=${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + token,
            }
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            let objResponse = {
                cellarId: id,
                data: responseData
            }
            return objResponse;
        });
    },
    getCurrentInventory(id, token, sku){
        token = token.replace(/^"(.*)"$/, '$1');
        id = parseInt(id);
        return fetch(`https://apibodegas.loadingplay.com/v1/cellar/${id}/product/${sku}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + token,
            }
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            let objResponse = {
                cellarId: id,
                data: responseData
            }
            return objResponse;
        });
    }
}