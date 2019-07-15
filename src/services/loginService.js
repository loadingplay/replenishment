export default {
    getToken(data){
        console.log(data);

        let formBody = [];
        for (let property in data) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        console.log(formBody);

        fetch('https://accounts.loadingplay.com/oauth2/token', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody
        }).then(function (response) {
            return response.json();
        }).then(function (responseData) {
            console.log(responseData);
        });
    }
}