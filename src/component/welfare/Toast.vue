<template>
  <div v-show="show" class="toast" v-html="msg"></div>
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
    }
  }
</script>

<style scoped>
</style>
