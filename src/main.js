import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'

import AntDesign from 'ant-design-vue'
import { VueAxios } from '@/utils/request'
import 'ant-design-vue/dist/antd.css'

import '@/permission'

Vue.use(AntDesign)
Vue.use(VueAxios, router)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
