import axios from "axios";
const myAxios = axios.create({
    baseURL: 'http://localhost:8080/api'
})

// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
    console.log("我要发请求了",config)
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
    console.log("我收到请求了",response)
    // Do something with response data
    return response.data;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

export default myAxios;