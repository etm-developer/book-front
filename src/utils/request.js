import axios from 'axios'

// 创建axios实例
const DAPP_ID = 'ca962bcae9adee9c41f880404e5058451d0b67af6a526b06922b85aceb243788'
const BASE_URL = 'http://129.28.69.70:4096/api/dapps/'
const service = axios.create({
  baseURL: BASE_URL + DAPP_ID, // api的base_url
  timeout: 5000 // 请求超时时间
})

export default service
