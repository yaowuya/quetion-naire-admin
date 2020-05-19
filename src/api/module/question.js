import http from '../../http'

export default {
  // 登录
  getQuestion: async function(params) {
    return await http.get('question/getQuestion', { params: params })
  },
  addQuestion: async function(params) {
    return await http.post('question/addQuestion', params)
  },
  editQuestion: async function(params) {
    return await http.put('question/editQuestion', params)
  },
  deleteQuestion: async function(params) {
    return await http.delete('question/deleteQuestion', { params: params })
  }
}
