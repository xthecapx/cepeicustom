// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Archive from './Archive'
import VueResource from 'vue-resource'
import Paginate from 'vuejs-paginate'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.component('paginate', Paginate)

/* eslint-disable no-new */
new Vue({
  el: '#archive',
  template: '<Archive/>',
  components: { Archive }
})
