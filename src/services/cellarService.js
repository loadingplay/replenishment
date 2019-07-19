export default {
    postCellar(data, token){
        token = token.replace(/^"(.*)"$/, '$1');
        let formBody = [];
        for (let property in data) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        

        return fetch('https://apibodegas.loadingplay.com/v1/cellar', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + token,
            },
            body: formBody
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            return responseData
        });
    },
    getCellarById(id, token){
        token = token.replace(/^"(.*)"$/, '$1');
        return fetch(`https://apibodegas.loadingplay.com/v1/cellar/${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + token,
            }
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            return responseData
        });
    },
    getAllCellar(token){
        token = token.replace(/^"(.*)"$/, '$1');
        return fetch(`https://apibodegas.loadingplay.com/v1/cellar`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            return responseData
        });
    },
    putCellar(cellarId, data, token){
        token = token.replace(/^"(.*)"$/, '$1');
        let formBody = [];
        for (let property in data) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        return fetch(`https://apibodegas.loadingplay.com/v1/cellar/${cellarId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + token,
            },
            body: formBody
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            return responseData
        });
    },
    deleteCellar(id, token){
        token = token.replace(/^"(.*)"$/, '$1');
        return fetch(`https://apibodegas.loadingplay.com/v1/cellar/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + token,
            }
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            return responseData
        });
    },
}