<template>
    <div class="header-warp" ref="headerWrap">
        <div v-if="isIphone" class="top-status"></div>
        <div class="header" :class="{android: !isIphone }">
            <p v-text="title"></p>
            <div class="buts">
                <div class="buts-container" @click="goBack">
                  <img class="left" src="./left_but.png">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { isIphone } from '@/util/browser'
  import '@/util/goodsogoodapi'
  import { getQueryParams } from '@/util/query'
  import * as types from '@/store/mutation-types'
  import { mapState, mapMutations } from 'vuex'

  export default {
    data () {
      return {
        isIphone,
      }
    },
    props: {
      title: {
        type: String,
        default: '',
        required: true,
      },
      rightButton: {
        type: Object,
        default: () => { icon: false},
      }
    },
    methods: {
      goBack () {
        const path = this.$route.path
        // 如果是在首页则直接返回
        if (path === '/') {
          return hostSdk.closePage()
        }
        this.$router.back()
      }
    },
    computed: { }
  }
</script>

<style rel="stylesheet/less" lang="less">
    .header-warp {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        .top-status {
            height: 20px;
            background: #fff;
        }
        .header {
            border-bottom: 1px solid #F1F1F1;
            position: relative;
            background: #fff;
            height: 44px;
            p {
                position: absolute;
                width: 100%;
                text-align: center;
                line-height: 44px;
                z-index: 1;
                font-size: 1.125rem;
                color: #333;
            }
            .buts {
                position: relative;
                z-index: 2;
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding:0 .8rem 0 .5rem;
                .left, .right {
                    width: auto;
                    height: 20px;
                    align-self: center;
                }
                .share {
                    padding: .5rem;
                    width: 1.875rem;
                }
                .buts-container{
                  position: relative;
                  display: flex;
                  align-items: center;
                }
                .buts-container::after{
                  position: absolute;
                  top: 0;
                  left: -10px;
                  content: '';
                  width: 50px;
                  height: 100%;
                }
            }
        }
        .android {
            height: 56px;
            p {
                line-height: 56px;
                font-size: 1.125rem;
            }
            .buts {
                .left, .right {
                    width: auto;
                    height: 1.1rem;
                    align-self: center;
                }
            }
        }

    }
</style>
