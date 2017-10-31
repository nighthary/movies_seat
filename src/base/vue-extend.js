/**
 * 注册全局属性、方法、组件
 */


import HeaderNav from '@/component/header'
import Loading from '@/component/loading'
import ScrollView from '@/component/scroll-view'

import 'assets/css/base.css'
import 'assets/css/style.css'

export default {
  install (Vue) {
    Vue.mixin({
      components: {
        HeaderNav,
        Loading,
        ScrollView
      },
      // 全局方法
      methods: {
        // 删除时间里面的i时分秒
        deleteTimes (str) {
          if (!str) return str

          str = str.split(' ')

          if (str.length < 2) {
            return str
          }

          return str[0]
        },
        // 时间格式化
        formatDate (time, format) {
          let o = {
            'M+': time.getMonth() + 1, //month
            'D+': time.getDate(), //day
            'h+': time.getHours(), //hour
            'm+': time.getMinutes(), //minute
            's+': time.getSeconds(), //second
            'q+': Math.floor((time.getMonth() + 3) / 3), //quarter
            'S': time.getMilliseconds() //millisecond
          }
          if (/(Y+)/.test(format)) {
            format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
          }
          for (var k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            }
          }
          return format
        },

        times (sendtime) {
          let oldTime = sendtime
          //发布时间去 '-'符号
          let oDate = new Date(Date.parse(sendtime.replace(/-/g, '/')))
          //发布时间转换为 字符串
          let send = Date.parse(oDate)
          //获取现在时间
          let now = new Date()
          //现在的时间转换 字符串
          let nowNew = Date.parse(now)
          //定义时间差
          let x = 0
          x = nowNew - send
          //console.log(nowNew+"-"+send+"="+x);
          if (x <= 1000 * 60 * 1) {
            sendtime = '刚刚'
          } else if (1000 * 60 * 1 < x && x <= 1000 * 60 * 60) {
            sendtime = Math.round((x / (1000 * 60))) + '分钟前'
          } else if (1000 * 60 * 60 * 1 < x && x <= 1000 * 60 * 60 * 24) {
            sendtime = Math.round(x / (1000 * 60 * 60)) + '小时前'
          } else if (1000 * 60 * 60 * 24 < x && x <= 1000 * 60 * 60 * 24 * 15) {
            sendtime = Math.round(x / (1000 * 60 * 60 * 24)) + '天前'
          } else if (x > 1000 * 60 * 60 * 24 * 15) {
            sendtime = oldTime
          }
          else {
            sendtime = '很久很久以前'
          }
          return sendtime
        },
        nonceStr (len) {
          len = len || 32
          let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
          /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
          let maxPos = $chars.length
          let str = ''
          for (let i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos))
          }
          return str
        },
        checkMobile (mobile) {
          return /^1[34578]\d{9}$/.test(mobile)
        },
        // 浮点数相乘
        accMul (arg1, arg2) {
          var m = 0
          var s1 = arg1.toString()
          var s2 = arg2.toString()
          try {
            m = m + s1.split('.')[1].length
          } catch (e) {}
          try {
            m = m + s2.split('.')[1].length
          } catch (e) {}
          return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
        },
        add (arg1, arg2) {
          var r1, r2, m
          try {r1 = arg1.toString().split('.')[1].length} catch (e) {r1 = 0}
          try {r2 = arg2.toString().split('.')[1].length} catch (e) {r2 = 0}
          m = Math.pow(10, Math.max(r1, r2))
          return (arg1 * m + arg2 * m) / m
        },
        /**
         * 小数减法法精度变化问题修复
         */
        sub (arg1, arg2) {
          return this.add(arg1, -arg2)
        }
      }
    })
  }
}