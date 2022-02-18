import axios from 'axios'
import { APP_API_URL } from './config'
import qs from 'qs'

// 这里取决于登录的时候将 token 存储在哪里
const token = localStorage.getItem('access_token')

const instance = axios.create({
    timeout: 5000
})

// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        //设置基础URL
        config.baseURL = APP_API_URL
        // 将 token 添加到请求头
        console.log(config)
        if (config.headers['No-Token'] === true) {
            delete config.headers['No-Token']
        } else {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        // 处理表单数据
        if (config.method === 'post') {
            config = processPostData(config)
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    error => {
        // 相应错误处理
        // 比如： token 过期， 无权限访问， 路径不存在， 服务器问题等
        switch (error.response.status) {
            case 401:
                break
            case 403:
                break
            case 404:
                break
            case 500:
                break
            default:
                console.log('其他错误信息')
        }
        return Promise.reject(error)
    }
)

/**
 *
 * @param config 配置信息
 * @returns
 */
function processPostData(config) {
    if (config.headers.post['Content-Type'] === 'application/x-www-form-urlencoded') {
        config.data = qs.stringify(config.data)
    }
    if (config.headers.post['Content-Type'] === 'application/json') {
        config.data = JSON.stringify(config.data)
    }
    return config
}

/**
 * http方法封装
 * @param {*} method 方法名称
 * @param {*} url 请求地址
 * @param {*} opts 请求参数
 * @returns
 */
export default function http(method, url, opts) {
    return new Promise((resolve, reject) => {
        instance(
            Object.assign(
                {},
                {
                    method,
                    url
                },
                opts
            )
        )
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })
    })
}
