<template>
  <div class="itemlistwrapper">
    <ul ref="itemlist" class="itemlist">
      <li v-for="(item, index) in items">
        <a href="javascript:;" @click.stop="handleSelectItem(item)">
          <span v-text="item.text"></span>
          <i class="iconfont icon-next"></i>
        </a>
        <input type="hidden" :value="item.value"/>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    // 列表项
    items: {
      type: Array,
      required: true
    },
    // 是否改变
    changed: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // 是否改变
    changed (newValue) {
      if (newValue) {
        let _list = this.$refs.itemlist
        if (_list) {
          _list.scrollTop = 0
        }
      }
    }
  },
  methods: {
    // 选择项目句柄
    handleSelectItem (item) {
      this.$emit('selectitem', item)
    }
  }
}
</script>

<style scoped>
.itemlistwrapper {
  width: 100%;
  height: -webkit-calc(100% - 4.5rem);
  height: -moz-calc(100% - 4.5rem);
  height: calc(100% - 4.5rem);
  overflow: hidden;
  position: absolute;
  top: 4.5rem;
  left: 0;
}

.itemlist {
  display: block;
  width: 100%;
  height: 100%;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.itemlist li {
  display: block;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 4.5rem;
  line-height: 4.5rem;
  border-bottom: solid 1px #F8F8F8;
  background-color: #FFFFFF;
  font-size: 1.57rem;
  cursor: pointer;
  outline: none;
}

.itemlist li a {
  display: block;
  padding: 0 1.8rem 0 2.14rem;
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
}

.itemlist li a:active {
  background-color: #E5E5E5;
}

.itemlist li span {
  display: block;
  width: -webkit-calc(100% - 2rem);
  width: -moz-calc(100% - 2rem);
  width: calc(100% - 2rem);
  height: 100%;
  color: #333333;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  float: left;
}

.itemlist li i {
  display: block;
  width: 2rem;
  height: 4.5rem;
  line-height: 4.5rem;
  color: #CCCCCC;
  font-size: 1.35rem;
  float: left;
}
</style>
