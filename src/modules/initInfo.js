import * as types from '../store/mutation-types'

export default {
  state: {
    openId: '',
    header: {
      title: '',
      onTap () {},
    }
  },
  mutations: {
    // 保存openid
    [types.SAVE_OPEN_ID] (state, value) {
      state.openId = value
    },
    // 保存头部状态
    [types.SAVE_HEADER_INFO] (state, header) {
      if (!header.rightButton) {
        header.rightButton = {
          icon: false
        }
      }
      state.header = header
    }
  },
  actions: {}
}