<template>
  <div class="searchbarwrapper">
    <div class="searchbar">
      <a href="javascript:;" class="back" @click="handleBack">
        <i class="iconfont icon-fanhui"></i>
      </a>
      <div class="input-wrapper img">
        <i class="iconfont icon-chazhao"></i>
        <input type="text" :placeholder="placeHolder" v-model="key"/>
        <a class="clear" @click="clear"></a>
      </div>
      <a href="javascript:;" class="button red confirm" @click.stop="handleConfirm">确定</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 注释
    placeHolder: {
      type: String,
      default: '请选择'
    },
    // 是否重置
    reset: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 查询条件
      key: ''
    }
  },
  watch: {
    // 是否重置
    reset (newValue) {
      if (newValue) {
        this.key = ''
      }
    }
  },
  methods: {
    // 清除
    clear () {
      this.key = ''
    },
    // 返回句柄
    handleBack () {
      this.$emit('back')
    },
    // 确定句柄
    handleConfirm () {
      this.$emit('confirm', this.key)
    }
  }
}
</script>

<style scoped>
.searchbarwrapper {
  width: 100%;
  height: 4.95rem;
  background-color: #E5E5E5;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.searchbar {
  display: -webkit-flex;
  display: -moz-flex;
  display: flex;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  justify-content: center;
  -webkit-align-items: center;
  -moz-align-items: center;
  align-items: center;
  padding: 0 1rem;
  padding-left: 0;
  width: 100%;
  height: 100%;
  border-bottom: solid 1px #DBDCDC;
  overflow: hidden;
}

.searchbar a.back {
  display: block;
  width: 3.02rem;
  height: 3.83rem;
  line-height: 3.83rem;
  color: #666666;
}

.searchbar a.back .iconfont {
  display: block;
  width: 100%;
  height: 100%;
  line-height: 3.73rem;
  font-size: 2.2rem;
  text-align: center;
}

.searchbar .input-wrapper {
  width: -webkit-calc(100% - 8.62rem);
  width: -moz-calc(100% - 8.62rem);
  width: calc(100% - 8.62rem);
  height: 3.83rem;
  position: relative;
}

.searchbar .input-wrapper input {
  padding-right: 2.41rem;
  width: -webkit-calc(100% - 2rem);
  width: -moz-calc(100% - 2rem);
  width: calc(100% - 2rem);
  height: 1.83rem;
  line-height: 1.83rem;
}

.searchbar .input-wrapper .iconfont {
  width: 2rem;
  height: 1.83rem;
  line-height: 1.83rem;
  font-size: 1.35rem;
}

.searchbar .input-wrapper .clear {
  margin-top: -.96rem;
  width: 1.91rem;
  height: 1.91rem;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  background-color: #CCCCCC;
  text-align: center;
  position: absolute;
  top: 50%;
  right: 1rem;
}

.searchbar .input-wrapper .clear:after {
  content: '×';
  display: block;
  margin-top: -.7rem;
  margin-left: -.7rem;
  width: 1.4rem;
  height: 1.4rem;
  line-height: 1.4rem;
  color: #FFFFFF;
  font-size: 1.6rem;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
}

.searchbar .button {
  margin-left: 1rem;
  width: 4.6rem;
  height: 3.83rem;
  line-height: 3.73rem;
}
</style>
