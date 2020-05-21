import http from '../../http'

export default {
  /**
   * 角色
   */
  getRole: async function(params) {
    return await http.get('rest/roles/page', { params: params })
  },
  getAllRole: async function(params) {
    return await http.get('rest/roles/', { params: params })
  },
  addRole: async function(params) {
    return await http.post('rest/roles/', params)
  },
  editRole: async function(params) {
    return await http.put(`rest/roles/${params.id}`, params.data)
  },
  deleteRole: async function(params) {
    return await http.delete(`rest/roles/${params.id}`, { params: params })
  },
  /**
   * 用户
   */
  getPerson: async function(params) {
    return await http.get('system/getPerson', { params: params })
  },
  getAllPerson: async function(params) {
    return await http.get('rest/persons/', { params: params })
  },
  getPersonByDoctor: async function(params) {
    return await http.get('system/getPersonByDoctor', { params: params })
  },
  addPerson: async function(params) {
    return await http.post('system/addPerson', params)
  },
  editPerson: async function(params) {
    return await http.put(`rest/persons/${params.id}`, params.data)
  },
  deletePerson: async function(params) {
    return await http.delete(`rest/persons/${params.id}`, { params: params })
  }
}
