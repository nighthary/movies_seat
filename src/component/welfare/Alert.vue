<template>
  <div v-show="show" class="alert">
    <div class="box">
      <div class="title">温馨提示</div>
      <div class="msg" v-html="msg"></div>
      <div class="bar">
        <a href="javascript:;" @click.stop="handleIKnow">我知道了</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      // 是否显示
      show: {
        type: Boolean,
        default: false
      },
      // 提示信息
      msg: {
        type: String,
        default: ''
      }
    },
    methods: {
      // 我知道了句柄
      handleIKnow () {
        this.$emit('iknow')
      }
    }
  }
</script>

<style scoped>
</style>
