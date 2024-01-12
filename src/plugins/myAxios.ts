import axios from "axios";

const isDev = process.env.NODE_ENV === 'development';

console.log(process.env.NODE_ENV);

const myAxios = axios.create({
    baseURL: isDev? 'http://localhost:8081/api':'http://yupao-backend.code-li.fun/api'
    // baseURL: 'yupao-backend.code-li.fun'
})

// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
    console.log(`do request url = ${config.url}`);
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
        window.location.href='/user/login'
    }
    return response.data;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

export default myAxios;