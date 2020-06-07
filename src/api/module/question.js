import http from '../../http'

export default {
  /**
   * 问卷管理
   */
  getQuestion: function(params) {
    return http.get('question/getQuestion', { params: params })
  },
  getAllQuestion: function(params) {
    return http.get('rest/questions/', { params: params })
  },
  addQuestion: function(params) {
    return http.post('question/addQuestion', params)
  },
  editQuestion: function(params) {
    return http.put('question/editQuestion', params)
  },
  deleteQuestion: function(params) {
    return http.delete('question/deleteQuestion', { params: params })
  },
  /**
   * 问卷类型管理
   */
  getQuestionType: function(params) {
    return http.get('question/getQuestionType', { params: params })
  },
  getAllQuestionType: function(params) {
    return http.get('rest/questionTypes/', { params: params })
  },
  addQuestionType: function(params) {
    return http.post('rest/questionTypes/', params)
  },
  editQuestionType: function(params) {
    return http.put(`rest/questionTypes/${params.id}`, params.data)
  },
  deleteQuestionType: function(params) {
    return http.delete(`rest/questionTypes/${params.id}`, { params: params })
  },
  /**
   * 题型管理
   */
  getTopic: function(params) {
    return http.get('rest/topics/page', { params: params })
  },
  getAllTopic: function(params) {
    return http.get('rest/topics/', { params: params })
  },
  addTopic: function(params) {
    return http.post('rest/topics/', params)
  },
  editTopic: function(params) {
    return http.put(`rest/topics/${params.id}`, params.data)
  },
  deleteTopic: function(params) {
    return http.delete(`rest/topics/${params.id}`, { params: params })
  },
  /**
   * 题目管理
   */
  getTitle: function(params) {
    return http.get('question/getTitle', { params: params })
  },
  getAllTitle: function(params) {
    return http.get('rest/titles/', { params: params })
  },
  getTitleByQuestion: function(params) {
    return http.get('question/getTitleByQuestion', { params: params })
  },
  getTitleAndOption: function(params) {
    return http.get('question/getTitleAndOption', { params: params })
  },
  addTitle: function(params) {
    return http.post('rest/titles/', params)
  },
  addOptionByTitle: function(params) {
    return http.post('question/addOptionByTitle', params)
  },
  editTitle: function(params) {
    return http.put(`rest/titles/${params.id}`, params.data)
  },
  deleteTitle: function(params) {
    return http.delete(`rest/titles/${params.id}`, { params: params })
  },
  /**
   * 选项管理
   */
  getOption: function(params) {
    return http.get('question/getOption', { params: params })
  },
  getAllOption: function(params) {
    return http.get('rest/options/', { params: params })
  },
  addOption: function(params) {
    return http.post('rest/options/', params)
  },
  editOption: function(params) {
    return http.put(`rest/options/${params.id}`, params.data)
  },
  deleteOption: function(params) {
    return http.delete(`rest/options/${params.id}`, { params: params })
  },
  /**
   * 答案管理
   */
  getAnswer: function(params) {
    return http.get('question/getAnswer', { params: params })
  },
  addAnswer: function(params) {
    return http.post('rest/answers/', params)
  },
  editAnswer: function(params) {
    return http.put(`rest/answers/${params.id}`, params.data)
  },
  deleteAnswer: function(params) {
    return http.delete('question/deleteAnswer', { params: params })
  },
  getAnswerDetail: function(params) {
    return http.get('question/getAnswerDetail', { params: params })
  },
  /**
   * 首页
   */
  getAnswerMerge: function(params) {
    return http.get('question/getAnswerMerge', { params: params })
  },
  getMergeDetail: function(params) {
    return http.get('question/getMergeDetail', { params: params })
  }
}
