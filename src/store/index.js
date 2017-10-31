import Vue from 'vue';
import Vuex from 'vuex';
import storage from './storage';
import initInfo from '../modules/initInfo';

// 注册vuex
Vue.use( Vuex );

// 设置全局state
const state = {
  transitionName: 'slide'
}

// 设置模块state状态
const modules = { initInfo };

export default new Vuex.Store( {
    plugins: [ storage ],
    state,
    modules
} )
