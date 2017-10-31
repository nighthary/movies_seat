<template>
    <div id="indexView" :style="containerHeight">
        <header-nav :title="header.title" :rightButton="header.rightButton"
                    :onTap="header.rightButton && header.rightButton.onTap"></header-nav>
        <div class="nav">
            <div class="col" @click.stop="showDown(1)">
                <span class="name">{{ level1Name }}</span>
                <img v-show="nowActiveNav !== 1" class="icon-block" src="./imgs/down-block@3x.png" alt="">
                <img v-show="nowActiveNav === 1 && isShowNavDown" class="icon-block active" src="./imgs/block-active@3x.png" alt="">
            </div>
            <div class="col" @click.stop="showDown(2)">
                <span class="name">{{ level2Name }}</span>
                <img v-show="nowActiveNav !== 2 "  class="icon-block" src="./imgs/down-block@3x.png" alt="">
                <img v-show="nowActiveNav === 2 && isShowNavDown"  class="icon-block active" src="./imgs/block-active@3x.png" alt="">
            </div>
            <div class="col" @click.stop="showDown(3)">
                <span class="name">{{ level3Name }}</span>
                <img v-show="nowActiveNav !== 3"  class="icon-block" src="./imgs/down-block@3x.png" alt="">
                <img v-show="nowActiveNav === 3 && isShowNavDown"  class="icon-block active" src="./imgs/block-active@3x.png" alt="">
            </div>
        </div>
        <div class="nav-down" ref="navDown" v-show="isShowNavDown" :style="navDownStyle">
            <div class="item" v-for="elem in navDownList" @click.stop="categorySelect(elem.id)"
                 :class="{active: elem.id === cateChoosed[`c${nowActiveNav}Id`]}">
                {{ elem.name }}
            </div>
            <loading :isFullScreen="false" :size="'small'" :isShow="isShowCateLoading" class="cate-loader"></loading>
        </div>
        <div class="pop-view" v-show="isShowNavDown" :style="navDownStyle" @click.stop="listClick"></div>
        <div class="list">
            <ScrollView
                    v-if="hasData === 1"
                    ref="scroller"
                    refreshKey="netease-list"
                    :onRefresh="refresh"
                    :height="scrollHeight"
                    :isDataEnd="isDataEnd"
                    :isCloseAddMore="isCloseAddMore"
                    :isLoadHideBottomInfo="isLoadHideBottomInfo"
                    :onAddMore="infinite"
            >
                <div class="row" v-for="course in courses" @click.stop="goDetail(course.detailUrl)">
                    <div class="img-container">
                        <img :src="course.imgUrl" alt="" class="logo">
                    </div>
                    <div class="right">
                        <div class="title text2">{{ course.name }}</div>
                        <div class="info"><span>评分&nbsp;{{ course.score }}</span><span class="member">人数&nbsp;{{ course.learnerCount
                            }}</span></div>
                    </div>
                </div>
            </ScrollView>

            <div v-if="hasData === -1" class="no-list-data">
                <img src="./imgs/no-data.png" alt="">
                <p>暂无课程 (^_^;)</p>
            </div>

            <div class="place-view" v-if="hasData === 0"></div>
        </div>
        <loading :isFullScreen="true" :size="'large'" :isShow="isShowLoading"></loading>
    </div>
</template>
<script>

  import { mapState, mapMutations } from 'vuex'
  import * as types from '@/store/mutation-types'
  import { isIphone } from '@/util/browser'
  import { getQueryParams } from '@/util/query'
  import { getCourseList, getCourseCategories, COURSE_DETAIL } from '@/service/apis'
  import Toast from 'Toast'

  const allName = '全部课程'
  export default {
    name: '',
    data () {
      return {
        isShowCateLoading: false,
        isIphone,
        headerHeight: 0,
        nowActiveNav: 0,
        isShowNavDown: false, // 是否显示分类下拉
        navDownList: [],
        isDataEnd: false,
        isCloseAddMore: false,
        isLoadHideBottomInfo: false,
        pageNo: 1,
        pageSize: 10,
        isFirst: true,
        isLoading: false,
        isShowLoading: false,
        hasData: 1, // 用于当前页面view显示的判断 0-空白页 -1 空数据页面 1 有数据页面  新增一个空白页处理页面跳转时的闪屏
        courses: [], // 课程列表
        level1Name: allName,
        level2Name: allName,
        level3Name: allName,
        category: { // 各级分类的下拉列表
          category1: [{
            id: -1,
            name: allName
          }],
          category2: [{
            id: -1,
            name: allName
          }],
          category3: [{
            id: -1,
            name: allName
          }]
        },
        cateChoosed: { // 当前选中的分类数据
          c1Id: '',
          c1Name: '',
          c2Id: '',
          c2Name: '',
          c3Id: '',
          c3Name: ''
        },
        windowHeight: window.localStorage.getItem('gsg-window-height') || document.body.offsetHeight
      }
    },
    components: {},
    methods: {
      ...mapMutations({
        saveHeaderInfo: types.SAVE_HEADER_INFO,
      }),
      getHeaderHeight () {
        let _headerWarp = document.querySelector('.header-warp')
        let height = (_headerWarp && _headerWarp.offsetHeight) ? _headerWarp.offsetHeight : isIphone ? 65 : 45
        this.headerHeight = height
      },
      showDown (type) {
        if (this.nowActiveNav === type) {
          this.isShowNavDown = !this.isShowNavDown
        } else {
          this.isShowNavDown = true
        }
        this.nowActiveNav = this.isShowNavDown ? type : 0
        this.fillNavDown()
      },
      hideNavDown () {
        this.isShowNavDown = false
        this.nowActiveNav = 0
      },
      fillNavDown () {
        let parentId = this.cateChoosed[`c${this.nowActiveNav - 1}Id`]
        // 第一级id直接为-1,其他级时如果父级ID为-1则为0加载默认数据，其他正常加载
        let _id = this.nowActiveNav === 1 ? -1 : (parentId === -1 ? 0 : parentId)

        if (_id) {
          this.getCategories({fid: _id}, this.nowActiveNav)
        } else {
          this.navDownList = Object.assign({}, this.category[`category${this.nowActiveNav}`])
        }
      },
      listClick () {
        this.hideNavDown()
      },
      // 选中某个分类
      categorySelect (id) {
        let _name = this.getCateName(id)
        this[`level${this.nowActiveNav}Name`] = _name
        this.cateChoosed[`c${this.nowActiveNav}Id`] = id
        this.cateChoosed[`c${this.nowActiveNav}Name`] = _name

        // 每次重新选择分类，都重置当前级别的子分类数据
        if (this.nowActiveNav === 1) {
          this.level2Name = allName
          this.level3Name = allName

          this.category.category2 = [{id: -1, name: allName}]
          this.category.category3 = [{id: -1, name: allName}]

          this.cateChoosed.c2Id = ''
          this.cateChoosed.c2Name = ''
          this.cateChoosed.c3Id = ''
          this.cateChoosed.c3Name = ''
        } else if (this.nowActiveNav === 2) {
          this.level3Name = allName
          this.category.category3 = [{id: -1, name: allName}]

          this.cateChoosed.c3Id = ''
          this.cateChoosed.c3Name = ''
        }

        let _params = this.getCourseParams()
        this.resetLoadState()
        // 界面滑动到顶部
        this.$refs.scroller && this.$refs.scroller.resetTopPosition()
        this.hideNavDown()

        this.getCourseList(null, _params, () => {
//          Toast.show({
//            place: 'top',
//            msg: '加载成功',
//            time: 2000
//          })
        })
      },
      getCourseParams () {
        let _params = {}
        if (this.cateChoosed.c1Id && this.cateChoosed.c1Id !== -1) {
          _params.level1CateId = this.cateChoosed.c1Id
        }

        if (this.cateChoosed.c2Id && this.cateChoosed.c2Id !== -1) {
          _params.level2CateId = this.cateChoosed.c2Id
        }

        if (this.cateChoosed.c3Id && this.cateChoosed.c3Id !== -1) {
          _params.level3CateId = this.cateChoosed.c3Id
        }
        return _params
      },
      // 根据分类ID获得分类名称
      getCateName (id) {
        let _data = this.category[`category${this.nowActiveNav}`]
        let categoryName = ''
        // 解决vue监听的对象不可枚举
        let _tmp = JSON.parse(JSON.stringify(_data))

        for (let i in _tmp) {
          if (_tmp[i].id === id) {
            categoryName = _tmp[i].name
          }
        }

        return categoryName
      },
      infinite (end) {
        if (this.isDataEnd) {
          return end && end()
        } else {
          let _params = this.getCourseParams()
          this.getCourseList(end, _params, () => {
//            Toast.show({
//              place: 'top',
//              msg: '加载成功',
//              time: 2000
//            })
          })
        }
      },
      refresh (end) {
        this.resetLoadState()
        let _params = this.getCourseParams()
        this.getCourseList(end, _params, () => {
          Toast.show({
            place: 'top',
            msg: '刷新成功',
            time: 2000
          })
        })
      },
      getCourseList (end, params, cb) {
        let _this = this, _params = {
          pageSize: this.pageSize,
          pageNo: this.pageNo
        }
        _params = Object.assign({}, _params, params)

        if (this.isLoading) return

        this.isLoading = true
        this.isShowLoading = true

        getCourseList(_params, (err, resp) => {
          if (err) {
            Toast.show({
              place: 'top',
              msg: '获取课程列表失败，请检查网络后重试！',
              time: '3000',
            })
          } else {
            if (0 === Number(resp.code)) {
              // 如果数据为空
              if (resp.totalCount === 0) {
                this.isCloseAddMore = true
                this.hasData = -1
              } else {
                _this.convertData(resp.data)
                if (_this.isFirst) {
                  _this.courses = resp.data || []
                  _this.isFirst = false
                } else {
                  _this.courses.push.apply(_this.courses || [], resp.data || [])
                }
                let _count = resp.data.length
                _this.hasData = 1
                _this.setLoadState(_count)
              }
            } else {
              _this.hasData = -1
              _this.isCloseAddMore = true
              Toast.show({
                place: 'top',
                msg: resp.message,
                time: 3000
              })
            }
          }
          end && end()
          cb && cb()
          this.isLoadHideBottomInfo = true
          this.isShowLoading = false
          this.isLoading = false
        })
      },
      setLoadState (count) {
        if (count < this.pageSize) {
          this.isDataEnd = true
        } else {
          this.pageNo++
        }
      },
      resetLoadState () {
        this.isCloseAddMore = false
        this.isDataEnd = false
        this.isFirst = true
        this.pageNo = 1
      },
      // 获得分类
      getCategories (params, nowActive) {

        let _this = this,
          _params = {
            pageSize: 50,
            pageNo: 1,
            fid: -1
          }

        _params = Object.assign({}, _params, params)

        this.isShowCateLoading = true
        getCourseCategories(_params, (err, resp) => {
          if (err) {
            Toast.show({
              place: 'top',
              msg: '获取数据失败，请检查网络后重试！',
              time: 3000,
            })
          } else {
            if (0 === Number(resp.code)) {
              resp.data.unshift({id: -1, name: allName})
              _this.category[`category${nowActive}`] = Object.assign({}, resp.data)
              _this.navDownList = Object.assign({}, resp.data)
            } else {
              Toast.show({
                place: 'top',
                msg: resp.message,
                time: 3000,
              })
            }
          }
          _this.isShowCateLoading = false
        })
      },
      convertData(data){
        for (let i = 0; i < data.length; i++) {
          data[i].score = data[i].score.toFixed(2)
          if(data[i].imgUrl){
            data[i].imgUrl = data[i].imgUrl.indexOf('https') > -1 ? data[i].imgUrl : data[i].imgUrl.replace('http', 'https')
          } else{
            data[i].imgUrl = 'https://assets.goodsogood.com/static/netease/default.png'
          }
        }
      },
      goDetail (url) {
        if (!this.openId) {
          return Toast.show({
            place: 'top',
            msg: '您未登录，请登陆后使用！',
            time: 3000,
          })
        }

        let _url = `${COURSE_DETAIL}?url=${url}&openId=${this.openId}`
        console.log(_url)
        hostSdk.openSpecifyUrl({
          openUrl: _url
        })
      }
    },
    computed: {
      ...mapState({
        openId: store => store.initInfo.openId,
        header: store => store.initInfo.header,
      }),
      containerHeight () {
        return {
          paddingTop: this.headerHeight + 'px'
        }
      },
      scrollHeight () {
        return `${this.windowHeight - this.headerHeight - 3 * 16}px`
      },
      navDownStyle () {
        return {
          top: `${this.headerHeight + 3 * 16}px`
        }
      }
    },
    mounted () {
      this.getHeaderHeight()
      this.saveHeaderInfo({
        title: '网易云课堂',
        rightButton: {
          icon: true,
          name: 'netEase'
        }
      })
      this.getCourseList()
    }
  }
</script>
<style rel="stylesheet/less" lang="less">
    @bgColor: #f5f5f5;
    @borderBColor: #f5f5f5;
    @choosedColor: red;
    #indexView {
        width: 100%;
        height: 100%;
        background-color: @bgColor;
        .nav {
            display: flex;
            flex-direction: row;
            height: 3rem;
            width: 100%;
            border-bottom: 1px solid @borderBColor;
            background-color: #fff;
            font-size: 15px;
            justify-content: space-around;
            .col {
                width: 33.33333%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                .name{

                }
                &:nth-child(2) {
                    border-left: 1px solid @bgColor;
                    border-right: 1px solid @bgColor;
                }
                .icon-block {
                    margin-left: 5px;
                    width: 8px;
                    height: auto;
                    &.active{
                        /*transform: rotateZ(180deg);*/
                        transition: .3s ease;
                    }
                }
            }
        }
        .nav-down {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 15rem;
            background-color: #fff;
            border-bottom: 1px solid @borderBColor;
            overflow: auto;
            z-index: 2;
            padding: 0 .625rem;
            .item {
                border-bottom: 1px solid @bgColor;
                padding: .5rem 0;
                font-size: .875rem;
                cursor: pointer;
                &.active {
                    border-bottom: 1px solid @choosedColor;
                    color: @choosedColor;
                }
            }
        }
        .list {
            width: 100%;
            height: 100%;
            .row {
                padding: 1.2rem .625rem;
                display: flex;
                flex-direction: row;
                background-color: #fff;
                font-size: .875rem;
                height: auto;
                border-bottom: 1px solid @borderBColor;
                .img-container {
                    width: 10rem;
                    height: 5rem;
                    .logo {
                        width: 100%;
                        height: 100%;
                    }
                }
                .right {
                    flex: 1;
                    margin-left: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .title {
                        font-size: 15px;
                        color: #333;
                        line-height: 20px;
                    }
                    .info {
                        font-size: 12px;
                        color: #999;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        .member{
                            margin-left: 40px;
                        }
                    }
                }
            }
            .scroll-view {
                background-color: @bgColor;
            }
            &.empty {
                .content {
                    height: 100%;
                }
            }
        }
        .place-view {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #F1F1F1;
        }

        .no-list-data {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #FFFFFF;
            img {
                width: 10rem;
                height: 10rem;
                margin-top: -15rem;
            }
            p {
                font-size: 1.125rem;
                color: #bbb;
                margin-top: 1rem;
            }
        }
        .cate-loader {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 10px;
        }
        .pop-view {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1;
            background-color: rgba(0, 0, 0, .3);
        }
    }

    @media screen and (max-width: 320px) {
        #indexView {
            .list {
                .row {
                    .logo {
                        width: 8rem;
                    }
                }
                .info{
                    span{
                        font-size: 12px;
                    }
                    .member{
                        margin-left: 15px !important;
                    }
                }
            }
        }
    }
</style>