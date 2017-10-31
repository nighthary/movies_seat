<!--
    通用列表组件
    带上拉刷新，下拉加载等功能
    由于作为一个单独的组件 不依赖其他框架   这里储存时间 选择直接用locastore储存
-->
<template>
    <div ref="scroll-view-warp" class="scroll-view" :style="{ height:height }">
        <div ref="scroll-view-content" class="content" :class="{ani:isAddAnimation}"
             :style="{transform: 'translate3d(0,'+ topPos +'px,0)'}">
            <div ref="header" class="header" :style="{height: headerHeight + 'px'}">
                <div v-show="topTextState === 3">
                    <p class="update">
                        <loading size="small" :style="{display:topTextState === 3?'inline-block':'none'}" />
                        <span>拼命刷新中...</span>
                    </p>
                </div>
                <div v-show="topTextState !== 3">
                    <p class="msg">
                        <img class="icon" :class="{rotate : topTextState===2}" src="./arrow.png">
                        <span v-text="topTextState === 1 ? updateMsg.textBefore : updateMsg.textAfter"></span>
                    </p>
                    <p v-if="refreshKey" class="last-refresh" v-text="'上一次刷新时间：'+times(updateMsg.lastRefresh)"></p>
                </div>
            </div>
            <div ref="scroll-view-list" class="scroll-view-list">
                <slot></slot>
            </div>
            <div class="footer" v-if="!isCloseAddMore && isLoadHideBottomInfo">
                <div v-show="bottomTextState === 3">
                    <p class="update">
                        <loading size="small" />
                        <span>拼命加载中...</span>
                    </p>
                </div>
                <div v-show="bottomTextState !== 3">
                    <p v-show="isDataEnd" class="no-data"
                       v-text="updateMsg.noMoreDataText"></p>
                    <p v-show="!isDataEnd" class="msg">
                        <img class="icon" :class="{rotate : !(bottomTextState===2)}" src="./arrow.png">
                        <span v-text="bottomTextState === 1 ? updateMsg.loadTextBefore : updateMsg.loadTextAfter"></span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import scrollViewContainer from './scroll';
  import '../../util/requestAnimationFrame';

  // 顶部刷新状态管理
  const TOP_STATE = {
      // 为下拉刷新  即为准备阶段
      START: 1,
      // 松开即将刷新
      READY_UPDATE: 2,
      // 刷新中
      UPDATE: 3,
    },
    // 底部加载状态管理
    BOTTOM_STATE = {
      // 为上拉加载  即为准备阶段
      START: 1,
      // 准备加载更多数据
      READY_ADD_DATA: 2,
      // 加载中
      ADD_DATA: 3,
      // 没有更多数据
      NO_MORE_DATA: -1,
    },
    defaultFunc = () => {
    },
    SESSION_TIMES = 'SESSTION:TIMES';

  export default {
    data () {
      return {
        updateMsg: {
          textBefore: '下拉刷新',
          textAfter: '松开即将刷新',
          loadTextBefore: '上拉加载更多',
          loadTextAfter: '松开加载更多',
          noMoreDataText: '没有更多数据了哦...',
          lastRefresh: '',
        },
        // 设置隐藏顶部提示文字的 临界值  最终未负值
        noUpdateTop: 73,
        // 设置顶部刷新的临界值
        updateTop: 0,
        // 设置显示松开刷新的临界值
        readyupdateTop: 20,
        // 设置当前界面停留的位置
        topPos: 0,
        // 保存上一次的定位状态  兼容第二次会从最开始的位置计算
        historyTop: 0,
        // 底部加载更多默认状态 临界值  通过计算获得
        noAddBottom: 0,
        // 底部加载更多状态 临界值  通过计算获得
        addBottom: 0,
        // 底部默认位置
        bottomHeight: 0,
        isAddAnimation: false,
        topTextState: TOP_STATE.START,
        bottomTextState: BOTTOM_STATE.START,

        // 记录开始滑动的位置
        startMoveY: null,
        // 设置缓动动画因素
        lastMoveTime: null,
        lastMovePosition: null,
        timer: null,
        // 控制当前状态是否 继续或者取消动画
        isInching: false,
        // 到达顶部或者底部的阻力系数
        resistance: 0.5,
        // 设置当前内容列表的高度是否超出了视口的高度  默认为超出 (超出则手指抬起正常计算)
        isOverflowParentWindow: false,
        // 固定下拉刷新内容的高度，防止动态获取时高度错误
        headerHeight: 64
      }
    },
    props: {
      // 当前窗口的高度
      height: {
        type: String,
        required: true,
      },
      touchStart: {
        type: Function,
        defualt: defaultFunc,
      },
      // 当执行刷新时的操作
      onRefresh: {
        type: Function,
        default: defaultFunc,
      },
      // 当执行 加载更多时的操作
      onAddMore: {
        type: Function,
        default: defaultFunc,
      },
      // 当前数据是否加载完毕  如果为true 则会忽略isLoadHideBottomInfo匹配
      isDataEnd: {
        type: Boolean,
        default: false,
      },
      // 首次加载是否显示 顶部 刷新提示信息
      isLoadShowTopInfo: {
        type: Boolean,
        default: false,
      },
      onScorll : {
        type: Function,
        default: defaultFunc,
      },
      // 首次加载是否显示 底部 加载更多提示信息
      isLoadHideBottomInfo: {
        type: Boolean,
        default: true,
      },
      // 是否关闭上拉加载功能  默认开启
      isCloseAddMore: {
        type: Boolean,
        default: false,
      },
      // 是否开启记录上次刷新的时间 默认关闭 传入记录唯一key
      refreshKey: {
        type: String,
        default: '',
      },
    },
    mounted(){
      const self = this,
        refs = self.$refs;

      // 初始化滚动信息
      new scrollViewContainer( {
        warp: refs[ 'scroll-view-warp' ],
        warpContent: refs[ 'scroll-view-content' ],
        stateUpdate( state, reset ){

        },
        touchStart( x, y, startTime ){
          // 初始化底部临界值
          self.updateBottomPosition();
          self.isAddAnimation = false;
          self.isInching = false;
          self.historyTop = self.topPos;

          // 记录当前内容区的高度  如果没有当前视口高 则手指抬起的时候直接返回
          self.isOverflowParentWindow = refs[ 'scroll-view-list' ].clientHeight <= parseInt( self.height );

          // 设置最后操作状态 记录缓动
          self.lastMoveTime = startTime;
          self.lastMovePosition = y;
          self.startMoveY = y;
        },
        touchMove( x, y ){
          const nowTime = Date.now(),
            nowMove = y;

          let newTopPos = -y + self.historyTop;

          self.onScorll(y);

          self.isInching = false;
          if ( newTopPos > -self.noUpdateTop || (!self.isCloseAddMore && newTopPos < -self.noAddBottom) ) {
            newTopPos = -(y * self.resistance) + self.historyTop;
          }

          // 如果底部状态关闭了  则不能看见底部
          if ( self.isCloseAddMore && newTopPos < -self.bottomHeight ) {
            return newTopPos = -self.bottomHeight;
          }

          self.topPos = newTopPos;

          // 如果当前状态是在刷新 或者加载中时直接返回 不执行其他操作
          if ( self.topTextState === TOP_STATE.UPDATE || self.bottomTextState === BOTTOM_STATE.ADD_DATA ) return;

          // 判断两层 只执行一次变化(下拉状态) 切换下拉状态为准备刷新
          if ( self.topPos >= self.readyupdateTop && self.topTextState !== TOP_STATE.READY_UPDATE ) {
            return self.topTextState = TOP_STATE.READY_UPDATE;
          }

          // 切换下拉状态为 开始默认状态
          if ( self.topPos < self.readyupdateTop && self.topTextState !== TOP_STATE.START ) {
            return self.topTextState = TOP_STATE.START;
          }

          // 当还有数据的时候
          if ( !self.isDataEnd ) {
            // 切换上拉状态为准备加载
            if ( self.topPos <= -self.addBottom && self.bottomTextState !== BOTTOM_STATE.READY_ADD_DATA ) {
              return self.bottomTextState = BOTTOM_STATE.READY_ADD_DATA;
            }
          }

          // 切换上拉状态为 开始默认状态
          if ( self.topPos > -self.addBottom && self.bottomTextState !== BOTTOM_STATE.START ) {
            return self.bottomTextState = BOTTOM_STATE.START;
          }

          // 设置最后操作状态 记录缓动 如果当前滑动时间大于100的时候设置当前系数
          // 优化  当速速较快时 也需要记录
          if ( nowTime - self.lastMoveTime > 50 || nowMove - self.startMoveY > 20 ) {
            self.lastMoveTime = nowTime;
            self.lastMovePosition = y;
          }
        },
        touchEnd( x, y, endTime ){


          self.isInching = true;

          const speed = (y - self.lastMovePosition) / (endTime - self.lastMoveTime),
            // 1为下  -1为上
            dir = y < 0 ? 1 : -1,
            // 每次递减的量系数
            speedPosition = 30,
            // 设置减速系数  用于计算最终的目标点
            deceleration = dir * 0.0006,
            //设置减速至0 需要的时间
            duration = speed / deceleration;

          let dist = self.topPos + duration / 2;

          if ( dir > 0 ) {
            dist = self.topPos - duration / 2;
          }

          function go() {

            if ( !self.isInching ) return cancelAnimationFrame( self.timer );

            let moveY;
            moveY = self.topPos + (dist - self.topPos) / speedPosition;


            if ( self.topPos >= -self.noUpdateTop + 5 ) {
              // 通过当前速度
              cancelAnimationFrame( self.timer );
              return self.resetTouchEndPosition( self );
            }
            // 判断是否到底部
            if ( self.topPos <= -self.noAddBottom - 20 ) {
              cancelAnimationFrame( self.timer );
              return self.resetTouchEndPosition( self );
            }

            // 判断是否到达指定位置附近 结束当前动画
            if ( (dir < 0 && self.topPos - 5 < dist) || (dir > 0 && self.topPos + 5 > dist) ) {
              console.log( '滚动结束' );
              cancelAnimationFrame( self.timer );
              return
            }

            self.topPos = moveY;

            self.timer = requestAnimationFrame( go );
          }

          self.timer = requestAnimationFrame( go );
        },
      } );

      // 更新一下header的高度
      this.noUpdateTop = this.headerHeight;

      // 隐藏首次加载是否显示 顶部 刷新提示信息
      if ( !self.isLoadShowTopInfo ) {
        self.topPos = -self.noUpdateTop;
      }

      // 加载上次刷新时间记录
      if ( self.refreshKey ) {
        self.saveBeforeTimes();
      }
    },
    components: {},
    methods: {
      /**
       * 刷新当前顶部定位
       * @param { Boolean }  [isUpdate]  // 是否刷新
       */
      resetTopPosition( isUpdate ){
        // 如果是刷新 则执行刷新相关的操作
        if ( isUpdate ) {
          // 修改定位 修改状态
          this.topPos = -this.updateTop;
          this.topTextState = TOP_STATE.UPDATE;

          this.saveBeforeTimes(true);
          this.onRefresh( () => this.end( true ) );
        } else {

          // 使用当前头部的高度
          this.topPos = -this.headerHeight;

          // 处理收回的时候 不应该显示出初始文字的问题  延迟时间必须和css里面的统一
          setTimeout( () => {
            this.isAddAnimation = false;
            this.topTextState = TOP_STATE.START;
            // 恢复正常的高度
            this.topPos = -this.noUpdateTop;
          }, 400 )
        }

        this.isAddAnimation = true;
      },
      /**
       * 刷新底部顶部定位
       * @param { Boolean }  [isUpdate]  // 是否刷新
       */
      resetBottomPosition( isUpdate ){
        // 如果是刷新 则执行刷新相关的操作
        if ( isUpdate && !this.isDataEnd ) {
          // 修改定位 修改状态
          this.topPos = -this.addBottom + 20;
          this.bottomTextState = BOTTOM_STATE.ADD_DATA;

          this.onAddMore( this.end );

        } else {
          this.topPos = this.isCloseAddMore ? -this.bottomHeight : -this.noAddBottom;
          // 处理收回的时候 不应该显示出初始文字的问题  延迟时间必须和css里面的统一
          setTimeout( () => (this.bottomTextState = BOTTOM_STATE.START), 400 )
        }

        this.isAddAnimation = true;
      },
      resetTouchEndPosition( self ){
        //往下拖动
        if ( self.topPos <= -self.noAddBottom && !self.isOverflowParentWindow ) {
          // 判断当前位置是否移动到 刷新位置   如果当前乡下拖动时  达不到预定的最低限制 则直接返回什么都不做
          if ( self.topPos <= -self.addBottom ) {
            self.resetBottomPosition( true );
          } else {
            // 否则定位到 初始位置
            self.resetBottomPosition();
          }

        } else if ( self.topPos > -self.noUpdateTop || self.isOverflowParentWindow ) {
          // 往上拖动
          // 判断当前是否定位到 刷新的位置
          if ( self.topPos >= self.readyupdateTop ) {
            self.resetTopPosition( true );
          } else {
            // 否则定位到 初始位置
            self.resetTopPosition();
          }
        }
      },
      /**
       * 保存或者取出之前的时间
       * @param { boolean }  [isSave]   是否保存
       */
      saveBeforeTimes( isSave ){
        let beforeTimes, newTime;
        if ( !isSave ) {
          beforeTimes = localStorage.getItem( `${SESSION_TIMES}-${this.refreshKey}` );

          // 处理当获取出来的值有可能是undefined 处理JSON报错的问题
          beforeTimes = JSON.parse( beforeTimes === 'undefined' ? 'null' : beforeTimes );

          // 如果存在则赋值
          console.log(beforeTimes !== null && beforeTimes !== 'undefined')
          if ( beforeTimes !== null && beforeTimes !== 'undefined' ) {
            this.updateMsg.lastRefresh = beforeTimes;
          } else {
            this.saveBeforeTimes(true);
          }
        } else {
          newTime = this.formatDate( new Date( Date.now() ), 'YYYY-MM-DD hh:mm:ss' );

          // 保存时间
          this.updateMsg.lastRefresh = newTime;

          // 保存在缓存
          localStorage.setItem( `${SESSION_TIMES}-${this.refreshKey}`, JSON.stringify( newTime ) );
        }
      },
      // 重置顶部状态
      end( isTop ){
        this.isAddAnimation = true;
        if ( isTop ) {
          // 重置顶部刷新 定位 状态
          this.resetTopPosition();
        } else {
          // 重置底部加载 定位 状态
          this.resetBottomPosition();
        }
      },
      // 刷新当前底部的临界值状态 加载数据后需要更新
      updateBottomPosition(){
        const contentHeight = this.$refs[ 'scroll-view-content' ].clientHeight,
          bottomHeight = contentHeight - parseInt( this.height );

        this.noAddBottom = bottomHeight - 40;
        this.bottomHeight = bottomHeight;
        this.addBottom = bottomHeight + 40;
      },
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
    .scroll-view {
        overflow: hidden;
        touch-action: none;
        background: #FFF;
        .content {
            .header, .footer {
                text-align: center;
                .msg {
                    .icon {
                        transform: rotate(-90deg);
                        height: 1.5rem;
                        transition: all .3s 0s ease-in-out;
                    }
                    .rotate {
                        transform: rotate(90deg);
                    }
                    span {
                        vertical-align: 6px;
                        color: #666;
                        font-size: .875rem;
                    }
                }
                .last-refresh {
                    font-size: .875rem;
                    color: #666;
                }
                .update {
                    padding: .25rem 0;
                    span {
                        font-size: .875rem;
                        color: #666;
                        vertical-align: 5px;
                    }
                }
                .no-data {
                    color: #999;
                    font-size: .875rem;
                }
            }
            .footer {
                padding: .5rem 0;
            }
            .scroll-view-list {
                background: #fff;
            }
        }
        .ani {
            transition: all .4s 0s ease;
        }
    }
</style>
