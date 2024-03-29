import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// 创建实例
const service: AxiosInstance = axios.create({
    timeout: 1000 * 60 * 30,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // TODO 在这里可以加上想要在请求发送前处理的逻辑
        // TODO 比如 loading 等
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        // console.log(response)
        if (response.status === 200) {
            // 请求成功
            if (response?.data) return response.data
            else return response
        }
        console.info(JSON.stringify(response.status))
        return response
    },
    (error: AxiosError) => {
        const { response } = error
        if (response) {
            console.error('异常错误');
            return Promise.reject(response.data);
        }
        console.warn('网络连接异常,请稍后再试!');
        return Promise.reject(error);
    }
)

export default service