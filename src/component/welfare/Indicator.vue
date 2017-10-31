<template>
  <div v-show="show" class="indicator">
    <!--<div class="box">
      <div class="pos">
        <div id="circularG">
          <div id="circularG_1" class="circularG"></div>
          <div id="circularG_2" class="circularG"></div>
          <div id="circularG_3" class="circularG"></div>
          <div id="circularG_4" class="circularG"></div>
          <div id="circularG_5" class="circularG"></div>
          <div id="circularG_6" class="circularG"></div>
          <div id="circularG_7" class="circularG"></div>
          <div id="circularG_8" class="circularG"></div>
        </div>
        <i class="fa fa-spinner fa-pulse"></i>
        <div class="msg" v-text="msg"></div>
      </div>
    </div>-->
    <div class="cssload-container">
      <div class="cssload-speeding-wheel"></div>
      <div class="msg" v-text="msg"></div>
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
      default: '加载中...'
    }
  }
}
</script>

<style scoped>
</style>
