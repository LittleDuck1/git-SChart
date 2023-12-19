import Vue from 'vue'
import Router from 'vue-router'
import index from '../views/index.vue'
import Home from '../components/home.vue'
import EditGrid from '../components/editCanvas/editGrid.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: index,
      children: [
        {
          path: '/',
          redirect: '/home'
        },
        {
          path: '/home',
          component: Home
        },
        {
          path: '/editGrid',
          component: EditGrid
        },

      ]
    }
  ]
})
