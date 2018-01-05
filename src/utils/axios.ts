import Axios from 'axios'
import Cookies from 'js-cookies'
import { Debug } from 'utils'
import { notification } from 'antd'
import mockUser from 'pages/User/mock'

const debug = Debug(__filename)
const isObj = obj => typeof obj === 'object' && obj && (obj.constructor === Object || !obj.constructor)

const axios = Axios.create({
  baseURL: '',
  timeout: 300000,
  headers: {},
  // transformRequest: data => {
  //   if (isObj(data)) {
  //     return Object.keys(data).map(key =>
  //         `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&')
  //   }
  //   return data
  // }
})

axios.interceptors.request.use(config => {
  if (!config.method) {
    return config
  }
  switch (config.method) {
    case 'GET':
      config.params = config.params || {}
      config.params.ck = Cookies.getItem('ck')
      break
    case 'POST':
    case 'PUT':
      config.data = config.data || {}
      config.data.ck = Cookies.getItem('ck')
      break
    default:
      break
  }
  debug('axios request', config.params, config.data)
  return config
}, function (error) {
  console.error('request error', error, error.request)
  notification.error({
    message: '请求失败:' + error.message,
    description: '',
  })
  return Promise.reject(error)
})

axios.interceptors.response.use(res => {
  if (res.data) {
    console.log('response', res.data)
  }
  return res.data
}, function (error) {
  console.error('response error', error, error.response)
  const data = error.response.data || {}
  notification.error({
    message: '操作失败:' + (data.localized_message || data.message || 'Unknown'),
    description: '',
  })
  return Promise.reject(error)
})

mockUser(axios)

export default axios

if (__DEV__) {
  (window as any).axios = axios
  ;(window as any).Cookies = Cookies
}
