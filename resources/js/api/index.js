import axios from "axios";

const api = axios.create()

api.interceptors.request.use(config => {
    if(localStorage.getItem('accessToken')) {
        config.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`
    }
    return config;
},error =>{
    return Promise.reject(error)
})

api.interceptors.response.use(response => {
    return response;
}, error => {
    if(error.response.status === 401) {
        localStorage.removeItem('accessToken')
        const locale = window.location.pathname.replace(/^\/([^\/]+).*/i, '$1');
        window.location.replace(`/${locale}/?show-login=open`)
    }
    return Promise.reject(error)
})

export default api;
