import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import router from './router';
import store from './store';
import vueExtend from './base/vue-extend';

import FastClick from 'fastclick'


import  VueTouch from 'vue-touch'

// vue调试模式
Vue.config.devtools = true;

// 注册vue-router
Vue.use( VueRouter ) ;

// 注册全局方法/组件
Vue.use( vueExtend );

Vue.use(VueTouch, {name: 'v-touch'})

router.back = function () {
  this.isBack = true;
  this.go( -1 );
}

document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
}, false);
      

const watch = {
  '$route'(){
    if(this.$router.isBack){
      store.state.transitionName = 'slide-back';
    }else{
      store.state.transitionName = 'slide-next';
    }
    this.$router.isBack = false;
  }
}


new Vue( {
    router,
    store,
    watch,
    render: h => h( App )
} ).$mount( '#app' )
