import http from '../../http'

export default {
  /**
   * 角色
   */
  getRole: function(params) {
    return http.get('rest/roles/page', { params: params })
  },
  getAllRole: function(params) {
    return http.get('rest/roles/', { params: params })
  },
  addRole: function(params) {
    return http.post('rest/roles/', params)
  },
  editRole: function(params) {
    return http.put(`rest/roles/${params.id}`, params.data)
  },
  deleteRole: function(params) {
    return http.delete(`rest/roles/${params.id}`, { params: params })
  },
  /**
   * 用户
   */
  getPerson: function(params) {
    return http.get('system/getPerson', { params: params })
  },
  getAllPerson: function(params) {
    return http.get('system/getAllPerson', { params: params })
  },
  getPersonByDoctor: function(params) {
    return http.get('system/getPersonByDoctor', { params: params })
  },
  addPerson: function(params) {
    return http.post('system/addPerson', params)
  },
  editPerson: function(params) {
    return http.put(`rest/persons/${params.id}`, params.data)
  },
  deletePerson: function(params) {
    return http.delete(`rest/persons/${params.id}`, { params: params })
  }
}
