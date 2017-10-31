<template>
    <div id="app">
        <transition :name="transitionName">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
  import * as types from './store/mutation-types'
  import { getQueryParams } from '@/util/query'
  import Toast from 'Toast'

  export default {
    components: {},
    computed: {
      ...mapState({
        transitionName: store => store.transitionName,
        openId: store => store.initInfo.openId,
      })
    },
    data () {
      return {
        // 页面高度
        documentHeight: 0,
        // 手机原生键盘是否弹出
        keyboardDisplay: false,
        // 焦点对象
        focusObj: null,
        // 焦点对象父对象
        focusObjParent: null
      }
    },
    methods: {
      ...mapMutations({
        saveOpenId: types.SAVE_OPEN_ID
      }),
    },
    mounted () {
      document.body.addEventListener( 'touchmove', ( ev ) => {
        document.activeElement.blur()
      }, true );

//      let localParams, openId, _this = this, id
//
//      localParams = getQueryParams()
//
//      openId = localParams['openid']
//      // 判断当前openid是否存在 或者已经刷新 则重新刷新
//      if (openId) {
//        // 保存或者刷新openId
//        this.saveOpenId(openId)
//      }
//
//      if (!localParams['openid']) {
//        Toast.show({
//          place: 'top',
//          msg: '您未登录，请登陆后使用！',
//          time: 5000,
//        })
////        this.saveOpenId('f7d5e53e2f2b61d3f1405b3ccbe072e8')
//      }
//      let windowHeight = window.localStorage.getItem('gsg-window-height')
//      if(!windowHeight){
//        window.localStorage.setItem('gsg-window-height', document.body.offsetHeight)
//      }
    }
  }
</script>

<style>

</style>
