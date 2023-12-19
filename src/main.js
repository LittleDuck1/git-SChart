import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import * as echarts from 'echarts';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css'
import Chat from 'vue-beautiful-chat'
//codemirror
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.use(VueCodemirror)
Vue.use(Chat)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  mounted() {
    window.addEventListener('pushstate', this.popstate)
  },
  beforeDestroyed() {
    // 清除popstate事件
    window.removeEventListener("pushstate", this.popstate)
  },
  methods: {
    popstate() {
      history.pushState(null, null, document.URL)
    }
  },
  router,
  render: h => h(App)
})
