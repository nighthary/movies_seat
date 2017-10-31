<template>
  <div v-show="show" class="applysuccess bg">
    <div class="content">
      <i class="iconfont icon-success red"></i>
      <div class="title">提交成功</div>
      <div class="info">首次申请需工作人员上门激活，请耐心等待1-3个工作日或直接拨打<a class="link" href="tel:4000020911">4000020911</a>服务热线。</div>
      <a class="button red" href="javascript:;" @click="handleBackWallet">我知道了</a>
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
    }
  },
  methods: {
    // 返回钱包句柄
    handleBackWallet () {
      this.$emit('backwallet')
    }
  }
}
</script>

<style scoped>
.applysuccess {
  z-index: 2;
}

.applysuccess .content {
  width: 85%;
}

.applysuccess .content > .title {
  margin: 1.12rem 0 2.28rem 0;
}

.applysuccess .info {
  padding: .84rem;
  line-height: 1.8rem;
  -webkit-border-radius: .4rem;
  -moz-border-radius: .4rem;
  border-radius: .4rem;
  background-color: #FFFFFF;
  color: #333333;
  font-size: 1.57rem;
  text-align: left;
}

.applysuccess .info .link {
  margin: 0;
  color: #000000;
  font-size: 1.57rem;
  text-decoration: underline!important;
}
</style>
