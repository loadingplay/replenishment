export default  {
    isLoggedIn(){
        let expiresAt = JSON.parse(window.localStorage.getItem('expires_at'))
        if(!window.localStorage.getItem('token') || new Date().getTime() < expiresAt){
            return false;
        } else {
            return true;
        }
    },

    logout() {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('expiresAt')
        window.location = 'https://accounts.loadingplay.com/auth/logout';
    }
  } 