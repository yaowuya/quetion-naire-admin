import http from '../../http'

export default {
  /**
   * 问卷管理
   */
  getQuestion: async function(params) {
    return await http.get('question/getQuestion', { params: params })
  },
  getAllQuestion: async function(params) {
    return await http.get('rest/questions/', { params: params })
  },
  addQuestion: async function(params) {
    return await http.post('question/addQuestion', params)
  },
  editQuestion: async function(params) {
    return await http.put('question/editQuestion', params)
  },
  deleteQuestion: async function(params) {
    return await http.delete('question/deleteQuestion', { params: params })
  },
  /**
   * 题型管理
   */
  getTopic: async function(params) {
    return await http.get('rest/topics/page', { params: params })
  },
  getAllTopic: async function(params) {
    return await http.get('rest/topics/', { params: params })
  },
  addTopic: async function(params) {
    return await http.post('rest/topics/', params)
  },
  editTopic: async function(params) {
    return await http.put(`rest/topics/${params.id}`, params.data)
  },
  deleteTopic: async function(params) {
    return await http.delete(`rest/topics/${params.id}`, { params: params })
  },
  /**
   * 题目管理
   */
  getTitle: async function(params) {
    return await http.get('question/getTitle', { params: params })
  },
  addTitle: async function(params) {
    return await http.post('rest/titles/', params)
  },
  editTitle: async function(params) {
    return await http.put(`rest/titles/${params.id}`, params.data)
  },
  deleteTitle: async function(params) {
    return await http.delete(`rest/titles/${params.id}`, { params: params })
  }
}
