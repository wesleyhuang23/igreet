import Vue from 'vue'
import App from './App.vue'
import resource from 'vue-resource'
import vueJsonp from 'vue-jsonp';

Vue.use(resource);
Vue.use(vueJsonp);

new Vue({
  el: '#app',
  render: h => h(App)
})
