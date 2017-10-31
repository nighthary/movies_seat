<template>
  <label :class="['checkbox', colorClass, checked ? 'checked' : '']">
    <a href="javascript:;" @click="handleClick">
      <span class="box"></span>
      <span class="text" v-if="text !== ''" v-text="text"></span>
    </a>
  </label>
</template>

<script>
export default {
  props: {
    // 颜色类名
    colorClass: {
      type: String,
      default: 'green'
    },
    // 文字
    text: {
      type: String,
      default: ''
    },
    // 值
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let _checked = this.value
    return {
      // 是否选择
      checked: _checked
    }
  },
  watch: {
    value (newValue) {
      this.checked = newValue
    }
  },
  methods: {
    // 单击
    handleClick () {
      this.checked = !this.checked
      this.$emit('change', this.checked)
    }
  }
}
</script>

<style scoped>
.checkbox {
  cursor: pointer;
}

.checkbox a {
  display: block;
  width: 100%;
  color: #333333;
  outline: none;
  -webkit-tap-highlight-color: rgba(255,255,255,0);
}

.checkbox.greenall a {
  color: #40B340;
}

.checkbox.redall a {
  color: #E71919;
}

.checkbox .box {
  display: block;
  width: 1.69rem;
  height: 1.69rem;
  border: solid 1px #E5E5E5;
  -webkit-border-radius: .3rem;
  -moz-border-radius: .3rem;
  border-radius: .3rem;
  background-color: #FFFFFF;
  color: #FFFFFF;
  float: left;
  position: relative;
}

.checkbox.green .box,
.checkbox.greenall .box {
  border: solid 1px #40B340;
}

.checkbox.red .box,
.checkbox.redall .box {
  border: solid 1px #E71919;
}

.checkbox .box:after {
  content: '√';
  width: 100%;
  height: 100%;
  line-height: 1.69rem;
  font-size: 1rem;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
}

.checkbox .text {
  display: block;
  padding-left: .4rem;
  width: -webkit-calc(100% - 1.69rem);
  width: -moz-calc(100% - 1.69rem);
  width: calc(100% - 1.69rem);
  line-height: 1.69rem;
  font-size: 1.35rem;
  float: left;
}

.checkbox.checked .box {
  background-color: #E5E5E5;
}

.checkbox.green.checked .box,
.checkbox.greenall.checked .box {
  background-color: #40B340;
}

.checkbox.red.checked .box,
.checkbox.redall.checked .box {
  background-color: #E71919;
}
</style>
