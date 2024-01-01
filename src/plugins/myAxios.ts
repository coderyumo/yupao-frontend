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
    // 未登录跳转到登录页面
    if (response?.data?.code===40100){
        window.location.href="/user/login"
    }
    return response.data;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

export default myAxios;