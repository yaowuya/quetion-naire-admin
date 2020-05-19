import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import './plugins/index'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import http from './http'
import api from '@/api/index'
import { getToken } from './utils/auth'

Vue.prototype.$http = http
Vue.prototype.$api = api

Vue.config.productionTip = false

Vue.mixin({
  computed: {
    uploadUrl() {
      return this.$http.defaults.baseURL + '/upload'
    }
  },
  methods: {
    getAuthHeaders() {
      return {
        Authorization: 'Admin ' + getToken()
      }
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
