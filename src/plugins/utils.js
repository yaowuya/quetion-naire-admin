import Vue from 'vue'

// 拷贝
Vue.prototype.$CopyRow = function(target, source) {
  const result = {}
  for (const key of Object.keys(target)) {
    result[key] = source[key]
  }
  return result
}
