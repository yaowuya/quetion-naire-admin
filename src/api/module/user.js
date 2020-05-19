import http from '../../http'

export default {
  // 登录
  login: async function(params) {
    return await http.post('login', params)
  },
  getUserByName: async function(params) {
    return await http.get(`user/users/findByName/${params.username}`, { params: params })
  },
  // 注册
  registerUser: async function(params) {
    return await http.post('user/users', params)
  }
}
