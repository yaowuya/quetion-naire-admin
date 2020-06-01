import http from '../../http'

export default {
  // 登录
  login: function(params) {
    return http.post('login', params)
  },
  getUserByName: function(params) {
    return http.get(`user/users/findByName/${params.username}`, { params: params })
  },
  // 注册
  registerUser: function(params) {
    return http.post('user/users', params)
  }
}
