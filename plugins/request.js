/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'

// 创建请求对象
export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 通过插件机制获取到上下文对象（query、params、req、res、app、store...）
// 插件导出函数必须作为 default 成员
export default ({ store, redirect }) => {

  // 请求拦截器
  // Add a request interceptor
  // 任何请求都要经过请求拦截器
  // 我们可以在请求拦截器中做一些公共的业务处理,例如统一设置 token
  request.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 请求就会经过这里
    const { user } = store.state

    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }

    // 返回 config 请求配置对象
    return config
  }, function (error) {
    // 如果请求失败(此时请求还没有发出去)就会进入这里
    // Do something with request error
    return Promise.reject(error)
  })


  // 添加响应拦截器
  request.interceptors.response.use(function (response) {
    // console.log(response, '添加响应拦截器1')
    // 对响应数据做点什么
    return response;
  }, function (error) {
    const status = (error.response && error.response.status && error.response.status) || '';
    const data = (error.response && error.response.data) || {};
    console.log(status, data, '添加响应拦截器')
    if (status == 404) {
      redirect('/')
    }
    // 对响应错误做点什么
    return Promise.reject(data);
  });

}
