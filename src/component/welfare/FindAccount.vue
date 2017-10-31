<template>
  <div v-show="show" class="findaccount">
    <search-bar :place-holder="'请输入企业全称'" :reset="searchBar.reset" @back="handleBack" @confirm="searchUnit"></search-bar>
    <item-list :items="itemList.items" :changed="itemList.changed" @selectitem="handleSelectedUnit"></item-list>
    <div v-show="nodataShow" class="bg">
      <div class="content content2">
        <i class="iconfont icon-fail"></i>
        <div class="title error">未查询到此单位信息</div>
        <a class="button" href="javascript:;" @click="handleBack">返回</a>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from './SearchBar'
import ItemList from './ItemList'

import { mapGetters } from 'vuex'
import { companyList } from '../../service/apis'

export default {
  props: {
    // 是否显示
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    // 搜索栏
    SearchBar,
    // 列表
    ItemList
  },
  data () {
    return {
      // 搜索栏
      searchBar: {
        // 是否重置
        reset: false
      },
      // 列表
      itemList: {
        // 列表项目
        items: [],
        // 是否改变
        changed: false
      },
      // 未查找到单位提示是否显示
      nodataShow: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    // 是否显示
    show (newValue) {
      if (newValue) {
        this.searchBar.reset = true
        this.clearCompanyList()
        this.hideNoData()
      } else {
        this.searchBar.reset = false
      }
    }
  },
  methods: {
    // 显示未查询到单位提示
    showNoData () {
      this.nodataShow = true
    },
    // 隐藏未查询到单位提示
    hideNoData () {
      this.nodataShow = false
    },
    // 清空单位列表
    clearCompanyList () {
      let _items = this.itemList.items
      _items.splice(0, _items.length)
    },
    // 加载单位列表
    loadCompanyList (data) {
      let _this = this
      let _itemList = _this.itemList
      data.forEach(function (item) {
        _itemList.items.push({ text: item.companyTitle, value: item.companyId })
      })
      _itemList.changed = true
      window.setTimeout(() => {
        _itemList.changed = false
      }, 100)
    },
    // 查找单位
    searchUnit (key) {
      let _this = this
      let _app = _this.$parent.$parent.$parent
      if (key.trim() === '') {
        _app.showToast('请输入企业全称')
        return
      }
      _app.showIndicator('查找中...')
      let _postData = {
        tocken: _this.userInfo.token,
        plateformDeviceInfo: _app.getDeviceInfo(),
        plateformDeviceType: _app.getDeviceType(),
        keyword: key.trim()
      }
      companyList(_postData, (err, resp) => {
        _app.hideIndicator()
        if (err) {
          _app.showNetError(err)
        } else {
          if (resp.code !== 0) {
            _app.showApiError(resp.message)
          } else {
            _this.clearCompanyList()
            let _data = resp.data
            if (_data && _data.length > 0) {
              _this.hideNoData()
              _this.loadCompanyList(_data)
            } else {
              _this.showNoData()
            }
          }
        }
      })
    },
    // 选择单位句柄
    handleSelectedUnit (item) {
      this.$emit('selectedunit', item)
    },
    // 返回句柄
    handleBack () {
      this.$emit('back')
    }
  }
}
</script>

<style scoped>
.findaccount {
  width: 100%;
  height: 100%;
  background-color: #F3F5F7;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.findaccount .content2 {
  margin-top: 11.25rem;
}

.findaccount .content2 > .error {
  color: #E71919;
  font-size: 1.69rem;
}
</style>
