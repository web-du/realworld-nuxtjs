/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'

// 创建请求对象
export const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
})
 
 