import { getToken, setToken, removeToken } from '../../utils/auth'
import { setStore, removeStore } from '../../utils/storage'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  async setAllToken({ commit }, token) {
    commit('SET_TOKEN', token)
    setToken(token)
  },

  // user register
  async logout({ commit }) {
    commit('SET_TOKEN', '')
    removeToken()
    resetRouter()
    removeStore('userName')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
  async login({ commit }, name) {
    commit('SET_NAME', name)
    setStore('userName', name)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
