export default  {
    isLoggedIn(){
        let expiresAt = JSON.parse(window.localStorage.getItem('expiresAt'))
        if(!window.localStorage.getItem('token') || new Date().getTime() < expiresAt){
            return false;
        } else {
            return true;
        }
    },

    getCurrentToken(){
        let token = window.localStorage.getItem('token');
        return token;
    },

    logout() {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('expiresAt')
        window.location = 'https://accounts.loadingplay.com/auth/logout';
    }
  } 