export default {
    getToken(data) {

        let formBody = [];
        for (let property in data) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        

        return fetch('https://accounts.loadingplay.com/oauth2/token', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            return responseData
        });
    },

    getUser(token){
        return fetch('https://accounts.loadingplay.com/users/me', {
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
    }
}
