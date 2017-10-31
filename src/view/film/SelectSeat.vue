<template>
  <div class="seat bg-normal">
    <div class="screen">
      <h3 class="title">
        <div class="cima-name">4号厅</div>
      </h3>
    </div>
    <div ref="svgwrapper" class="svgwrapper">
      <v-touch @panstart="panstartView" @pinchin="pinchinView" @pinchout="pinchoutView" @panend="panendView">
        <div ref="svgscroll" class="svgscroll" @scroll="scrollSvg">
          <div class="container" ref="container">
            <svg v-show="layoutWidth > 0 && layoutHeight > 0" :width="layoutWidth" :height="layoutHeight" :viewBox="viewBox" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a3="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" a3:scriptImplementation="Adobe" id="svgseat">
              <defs>
                <filter v-show="true" v-if="hallSeatsIsFinish && seat" v-for="seat in hallSeats" track-by="id" :id="seat.id" primitiveUnits="objectBoundingBox">
                  <feImage v-if="hallSeatsIsFinish && seat" x="0" y="0" width="100%" height="100%" :xlink:href="[seat.isUsed ? imgNotCanSelectZuo : seat.selected ? imgSelectedZuo : imgZuo]" preserveAspectRatio="none"/>
                </filter>
              </defs>
              <a v-show="true" v-if="hallSeatsIsFinish && seat" v-for="seat in hallSeats" track-by="id" @click="selectSeat(seat)" :row="seat.row" :col="seat.col">
                <rect v-if="hallSeatsIsFinish && seat" :x="seat.x + 20" :y="seat.y" width="24" height="24" :filter="seat.filter" />
              </a>
            </svg>
          </div>
      </div>
      </v-touch>
      <div ref="rowno" class="rowno">
        <div v-show="true" v-if="hallSeatsIsFinish" v-for="no in hallSeatRowNos" track-by="$index" class="no" v-text="no"></div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'


import Toast from '@/util/toast'

import {seats, max_row, max_column} from '@/util/seats'

export default {
  components: {
  },
  data () {
    return {
      // 会议厅分区座位
      hallSeats: [],
      // 会议厅分区座位排序号
      hallSeatRowNos: [],
      // 会议厅分区座位序号
      hallSeatColNos: [],
      // 会议厅分区座位获取完成
      hallSeatsIsFinish: false,
      // 座位图
      imgZuo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2OTcwQjI0OUYzNDExRTdBN0Y1QUY1QkVDOUJGNTcxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ2OTcwQjI1OUYzNDExRTdBN0Y1QUY1QkVDOUJGNTcxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDY5NzBCMjI5RjM0MTFFN0E3RjVBRjVCRUM5QkY1NzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDY5NzBCMjM5RjM0MTFFN0E3RjVBRjVCRUM5QkY1NzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6QA1aeAAADYElEQVR42uycS2gTQRjHZ2Nqq5ZQH1SLFV+gB4vQiyIoYlVQ8YlFxSp4C4IPsKAXUS8WFS/qKYJ4EMGLByn14sVSD7Z4EsVHsV6EWlChwWdJsv4/97+yxM2mpCHput/Aj7TdzezMb2dmZ+fbrWXbttFkTEwVOCmeTCaDti8GJ8ABkAhh/dLgHrgO3hfaKZVKmXhAJlPBGXAE1Ib0RE8HR8E0ntCxgi0iIJNWsA5kwTHwKIQiNoMrrIfUp78UEY2gHgyCPvA2hCLqWP6ZrE9Jg6VFfvIzjMlbfqtUETaJhfjq4pbdrYtePnUeoSJUhIpQESpCRagIFaEiVISKUBEqQkWoCBWhIlSEilAR/5mIryAHMsaJIYYxpVn+HOtTMLmRroVgJ1gOpvBvi8Ac48QPL4FPPt+XWMEQ6AGvqlDRFrDVOMFqvwCOlH8p63Aa7OPfsyzvA/DBFSGVvwD2ghqfzCTs116kQGtBFxiooITV4CzYPs79t+T9/gusAefBOxEhAV4J+78BDz3dYBnYBr6BbvDRJ3OJkreBXcaJNB8yARHnMqY6nmGR8BQ8ZsXy0zywA8xg3dz4bYLf7QAjoFNE7OHGi+COJ5P1NDYMLpvCzxfsBnd5huYH7FfOtACsYr/v4onyS9JlVoImkAK9nm0vwC229k4ZLGdxw5O8TBIcTEVWQ0ChXnP8kH0bK9QtZvNTjjsYsF8Dyx8z/z7o0usZR/4GSE2B8WE8qYajciWTnXf8CV8xozyPsFSEzixVhIpQESpCRaiIySiiUjPM3GQXUal3Hsp+nHiZ8pGnW5eA26bISlCZUj1v8IYqIcLy2M8WaabSsuRp/pYqdO2gbpL1tB6rVBGfjbMoIws0G3nAuE+Gcnt701TnfY40b6NbfbqOrFW2sfzDrE9JImTh4hk4bJz3Ng7yDOSLyLA7ZKogQsq/36ceNk9cM9ckulmfkkSMgqu0vsE4q0JhegHMYiu4zxY7OpHB8jk4B1YYZyU4bCK+g5fgSzmuGpJJn06odGapIlSEiohmsvNFuDLGIiYi4516x3jDJKkpYiKa+fnDnUfINHoTOGWcd6hHIiBhLjjJnwdcETd4Cy2PBbRHbIyQuOk1V0QP+8tx40S0ayMgQR4h6GcP+PPOu6X/SMNJvwUYAH2En4tuF53LAAAAAElFTkSuQmCC',
      // 座位已选图
      imgNotCanSelectZuo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA5CAYAAACMGIOFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhGQjIwOTgwOUYzMTExRTdCMTVDQkZCNURBRTA3MzAxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhGQjIwOTgxOUYzMTExRTdCMTVDQkZCNURBRTA3MzAxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OEZCMjA5N0U5RjMxMTFFN0IxNUNCRkI1REFFMDczMDEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OEZCMjA5N0Y5RjMxMTFFN0IxNUNCRkI1REFFMDczMDEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4XWlS1AAACc0lEQVR42uyaz2sTQRTH36y720aaxMS2SarYGhWVWshJSYjQo9g/ISfvHgT/joJo757a/8C7olR7UvyBiBo3oaW1HppsBNtkyfje0pWm2uzSgDvdvi+8nZnNyzCfvM1M5mWElBIG0VrpJoSpM8vPfX30oJ0tCnEDixKaCeGrjbY8WyyvBHEWfpFEuCQVaHOgnp6gVSpSNgeN5JImxO385HnIjI2Doeuhk3UcB77/2IRq7dtcV8olvwD0jSRG8ToWKxen8nA2N6FcGOtrq1CtW1QtYjRfHeSn+fRTpgtFUEXlMlmvWurn5wfpTjIqPKL/0p5xjQ0CGQkxJEMyJEMyJEMyJEMyJEMyJEMyJEMy5HGG1MPOgP8XSLo8ffkih8UdtMl9rxeOCMetRSHS++7V0B5XpFzXEfAaNp6hpYfMIdA08cfLcRw3kat8pHS9YKB57W5Xwk57h6r3EX6WIrlgGma6MD0DJ2OxnjfvSd4qrYlMFvLnpnru/drehtfv36bbnfZDmniK46OjfwEedcWGh72keIkgTU2L5iS7m3w2eZ1kSIZkSIZkSIZkyGMOKXZ3JKruRLxxGYZxeMjkSMIt6cyMilrf3OgZZ99N80FKxONwOpWiQ0FuO4u/6nUFToLQPncDP3irXnPHR+M8NCTp6qXL8PHzJ/hiVV1TSQRI4wuU/ujrcEKHmSvTYP9sQbNlQ6fTCX8Lhd/BZDwBiZF4sMxB0I6pw6Cd8hLCkAzJkAwZZTjvwDJBWnarFUnIrWaDCovWyfmG3Xz05sM7SCVPgRAiEhHcshuAXNScF6vFMv3hcxcb99AuRCiQX9EeVKRc+C3AAGkjq5VStwWTAAAAAElFTkSuQmCC',
      // 座位选中图
      imgSelectedZuo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA5CAYAAACMGIOFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg3QkEzNjJGOUYzMTExRTc4QzA0QzZCRjk3QUJDNkE2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg3QkEzNjMwOUYzMTExRTc4QzA0QzZCRjk3QUJDNkE2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODdCQTM2MkQ5RjMxMTFFNzhDMDRDNkJGOTdBQkM2QTYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODdCQTM2MkU5RjMxMTFFNzhDMDRDNkJGOTdBQkM2QTYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Nl/yYAAACZUlEQVR42uyaS0sbURTHz53EZkZMrBmVoCj2sasIglQM7Reoq1ayEnXv2oWbrlzq1g+goBsprvwCLQQFISC1BbFvlGIziSaLuT6S6TlDgopNZjDCjNPzhzN37nDv5fz4z/POFZZlQSMam7wAL/VuOezYJux2sMHk2jAWSYwH4L3OMNKPn77ectNYODmJcK1YrGCMgv+0gTGeSadOGnVyVQjlVVzvh2i0B5SQ90aWS2dQLP6CnPFx1LLKq04G1HUSXXyOxZbePgCtD5/4zsbj/B6C7tLuCLq5Waud4jDOC9qQg35ULNZX3U3Wa+cEaZ+bfjhF/5n8ZV4djUAGQgzJkAzJkAzJkAzJkAzJkAzJkAzJkAxZQ2GvJ4fZybtykjZf99cnsXiLQfOO4h5yzA4m12av1EsYnzHmM+nUchgBp7GyqKo6qJp+raeUOZBm1veEqhrH3NuvHgpJ0+iX0lhC+BZycoYadHW/vNGZJm/vBSTmH9ef3Th+ePCB8p+ha/KRpnUE8lqscPXZNx4hgnn/qXAJfhlgSIZkSIZkSIZkyP8csvq6R0tK/KhqXqFQ5PaQ9AlDojUzflSh8ONannU/mmspgp2bmxO0KMiuR2O9oChN3jtYPodi4Sfkc5/s/CKNQJI6E0Nw9HsbjOyOHX4SAVJ+rqY/6p7P6FyiawROZR7wSxtKpVPP4egapJmMiNrmqr3rVZI0oNtB+RHCkAzJkAxJG8sqBxKuwmUR5DfT/BNIyArXd3pOLkgzu3h48B40rTMQc7DkoGkegTQNqi6INxPn9MNnCi5/+ARFXzDmMunU0l8BBgDqBK4PdtlRjQAAAABJRU5ErkJggg==',
      // 选座的座位
      selectedSeat: null,
      // 座位排号宽度
      layoutRowNoWidth: 24,
      // 座位牌号离座位宽度
      layoutRowNoPosX: 10,
      // 座位排号宽度
      layoutColNoWidth: 24,
      // 座位牌号离座位高度
      layoutColNoPosY: 10,
      // 座位尺寸
      layoutSeatSize: 24,
      // 座位图宽度
      layoutWidth: 0,
      // 座位图高度
      layoutHeight: 0,
      // 座位图svg视图尺寸
      viewBox: '0 0 0 0',
      // 座位图位置样式
      layoutStyle: 'top: 0; left: 0;',
      // 座位图padding
      layoutPadding: 10,
      // 座位图top
      layoutTop: 0,
      // 座位图left
      layoutLeft: 0,
      // 座位图平移开始top
      layoutTopStart: 0,
      // 座位图平移开始left
      layoutLeftStart: 0,
      // 座位图缩略图宽度
      layoutThumWidth: 0,
      // 座位图缩略图高度
      layoutThumHeight: 0,
      // 座位图缩略图svg视图尺寸
      viewBoxThum: '0 0 0 0',
      // 平面图缩略图座位图缩小比例
      layoutThumSeatSizeScale: 0,
      // 平面图缩略图宽度缩小比例
      layoutThumWidthScale: 0,
      // 平面图缩略图高度缩小比例
      layoutThumHeightScale: 0,
      // 平面图缩略图视图区宽度
      layoutThumScreenWidth: 0,
      // 平面图缩略图视图区高度
      layoutThumScreenHeight: 0,
      // 平面图缩略图视图区top
      layoutThumScreenTop: 0,
      // 平面图缩略图视图区left
      layoutThumScreenLeft: 0,
      // 座位图缩略图试图区样式
      layoutThumScreenStyle: 'width: 0; height: 0; top: 0; left: 0;',
      nowScale: 0,
      maxScale: 1,
      minScale: 0,
      isScale: false,
      normalX: 30,
      normalY: 30
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
  methods: {
    ...mapActions({
    }),
    panstartView(ev){

      let disX = ev.deltaX, disY = ev.deltaY;
      let transformStr = this.$refs.container.style.transform;

      let transXRegex = /\.*translateX\(([0-9]*|\-[0-9]*)px\)/i;
      transXRegex.test(transformStr)
      let translateX = RegExp.$1

      let transYRegex = /\.*translateY\(([0-9]*|\-[0-9]*)px\)/i;
      transYRegex.test(transformStr)
      let translateY = RegExp.$1

      this.transformContainer({
        x: Number(translateX) + parseInt(disX) * 5,
        y: Number(translateY) + parseInt(disY) * 5
      })

    },
    panendView(ev){

      let transformStr = this.$refs.container.style.transform;

      let transZRegex = /\.*translateX\(([0-9]*|\-[0-9]*)px\)/i;
      transZRegex.test(transformStr)
      let translateX = RegExp.$1

      let transYRegex = /\.*translateY\(([0-9]*|\-[0-9]*)px\)/i;
      transYRegex.test(transformStr)
      let translateY = RegExp.$1

      let taransform = {
        x: translateX,
        y: translateY,
        z: 0,
        scale: this.nowScale
      }

      // x： 左边界  Number(translateX) > nowScale * normalX 临界点 transformX = 0
      //    右边界   Number(translateX) < width * nowScale / 2 临界点 transformX =  -width * nowScale / 2 - normalX * nowScale

      if(Number(translateX) > this.nowScale * this.normalX){
        taransform.x = 0
      } else if(Number(translateX) < -this.layoutWidth * nowScale / 2){
        taransform.x = -this.layoutWidth * this.nowScale / 2 - this.normalX * this.nowScale
      }

      // y 上边界 Number(translateY) > initScale * normalY 临界点 transformY = 0
      //   下边界 Number(translateY) < -height * nowScale / 3 临界点 0

      if(Number(translateY) > initScale * this.normalY || Number(translateY) < -this.initScale * this.normalY ){
        taransform.y = 0
      }

      this.transformContainer(taransform)
    },
    pinchinView(){
      this.nowScale = this.minScale
      this.transformContainer({
        scale: this.nowScale
      })
      this.isScale = false
    },
    pinchoutView(){
      this.nowScale = this.maxScale
      this.transformContainer({
        scale: this.nowScale
      })
      this.isScale = true
    },
    transformContainer(transform){
      let str = [],_str = [], _container = this.$refs.container, _rowno = this.$refs.rowno

      if(transform.scale){
        str.push(`scale(${transform.scale}, ${transform.scale})`)
        _str.push(`scale(${transform.scale}, ${transform.scale})`)
      } else {
        str.push(`scale(${this.nowScale}, ${this.nowScale})`)
        _str.push(`scale(${this.nowScale}, ${this.nowScale})`)
      }

      if(transform.x){
        str.push(`translateX(${transform.x}px)`)
      } else {
        str.push(`translateX(0px)`)
      }

      if(transform.y){
        str.push(`translateY(${transform.y}px)`)
        _str.push(`translateY(${transform.y}px)`)
      } else {
        str.push(`translateY(0px)`)
        _str.push(`translateY(0px)`)
      }

      if(transform.z){
        str.push(`translateZ(${transform.z}px)`)
      } else {
        str.push(`translateZ(0px)`)
      }

      _container.style.transform = str.join(' ')
      _container.style.transformOrigin = `${0}px ${0}px 0px`
      _container.style.transition = 'transform .3s ease'
      _container.style.width = this.layoutWidth + 'px'

      _rowno.style.transform = _str.join(' ')
      _rowno.style.transformOrigin = `${0}px ${0}px 0px`
      _rowno.style.top = 30 * this.nowScale + 'px'
      _rowno.style.left = 16 * this.nowScale + 'px'
    },
    loadLayout () {
      // 获取座位布局总行数总列数
      this.layoutWidth = this.layoutSeatSize * (this.hallSeatColNos.length + 1) + this.layoutPadding * (this.hallSeatColNos.length - 1)
      this.layoutHeight = this.layoutSeatSize * (this.hallSeatRowNos.length) + this.layoutPadding * (this.hallSeatRowNos.length - 1)
      this.viewBox = '0 0 ' + this.layoutWidth + ' ' + this.layoutHeight

      let scale = window.screen.width / this.layoutWidth
      this.nowScale = scale
      this.minScale = scale
      setTimeout(() => {
        this.transformContainer({
          scale
        })
      }, 0)
    },
    // 获取座位
    getMeetingSeat () {
      let _this = this
      _this.hallSeats.splice(0, _this.hallSeats.length)
      _this.hallSeatRowNos.splice(0, _this.hallSeatRowNos.length)

      for(let i = 1; i<= max_column; i++){
        _this.hallSeatColNos.push(i)
      }

      for(let i = 1; i<= max_row; i++){
        _this.hallSeatRowNos.push(i)
      }
      seats.forEach((elem) => {
         let { left_px, top_px, status, ext_id, name, col, row} = elem

        let _seat = {}
        _seat.id = ext_id !== undefined ? ext_id : -1
        _seat.name = name || ''

        _seat.y = top_px
        _seat.x = left_px
        _seat.col = col
        _seat.row = row
        // flag 标示 0：普通座位，1：情侣左座，2：情侣右座
        // status 0-已售 1-正常 2-已选择
        _seat.isUsed = status === 0
        _seat.selected = false
        _seat.filter = 'url(#' + ext_id + ')'

        _this.hallSeats.push(_seat)
      })

      _this.loadLayout()
      window.setTimeout(() => {
        _this.hallSeatsIsFinish = true
      }, 50)
    },
    // 滑动座位图
    scrollSvg (e) {
      let _parent = e.target
      let _rowno = this.$refs.rowno
      if (_rowno) {
        _rowno.style.top = (30 - _parent.scrollTop) + 'px'
      }
    },
    // 选座
    selectSeat (seat) {
      if (seat.isUsed) {
        return
      }
      seat.selected = !seat.selected
    },
    // 确认选座
    confirmSeat () {
      let _this = this
      let _app = _this.$parent.$parent
      let _meetingInfo = _this.meetingInfo
      if (_meetingInfo.id === -1) {
        Toast.show({
          time:3000,
          msg: '未获取到会议信息',
          place: 'top'
        })
//        _this.showAlert('未获取到会议信息')
        return
      }
      if (!_this.selectedSeat) {
        return
      }
      _app.showIndicator('提交中...')
      let _postData = {
        token: _this.userInfo.token,
        userId: _this.userInfo.userId,
        plateformDeviceType: _app.getDeviceType(),
        plateformDeviceInfo: _app.getDeviceInfo(),
        meeting_id: _meetingInfo.id,
        seat_id: _this.selectedSeat.id
      }
    }
  },
  mounted () {
    this.getMeetingSeat()
  }
}
</script>

<style scoped>
.seat {
  overflow: hidden;
  width: 100%;
  background-color: #efeff4;
}


.seat .svgwrapper {
  width: 100%;
  height: -webkit-calc(100% - 17.9rem);
  height: -moz-calc(100% - 17.9rem);
  height: calc(100% - 17.9rem);
  overflow: hidden;
  position: relative;
  background-color: #efeff4;
}

.seat .svgwrapper .svgscroll {
  width: 100%;
  height: 100%;
  overflow: auto;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.seat .svgwrapper .svgscroll::-webkit-scrollbar{
  display: none;
}

.rowno {
  -webkit-border-radius: 2rem;
  -moz-border-radius: 2rem;
  border-radius: 2rem;
  position: absolute;
  top: 30px;
  left: 16px;
  z-index: 2;
  overflow: hidden;
}

.rowno .no {
  width: 24px;
  height: 30px;
  line-height: 25px;
  background-color: rgba(0, 0, 0, .2);
  color: #FFFFFF;
  font-size: 1rem;
  text-align: center;
}


.colno .no {
  width: 24px;
  height: 24px;
  line-height: 24px;
  background-color: rgba(0, 0, 0, .2);
  color: #FFFFFF;
  font-size: 1rem;
  text-align: center;
}

  .cima-name{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1rem;
    padding: 5px 60px;
    border: 1px solid rgb(209,209,209);
    background-color: rgb(245,245,245);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .title{
    position: relative;
    height: 50px;
  }
</style>
