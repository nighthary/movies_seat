<template>
  <div class="apply bg" :style="findAccount.show || applySuccess.show ? 'overflow-y: hidden;' : 'overflow-y: auto;'" id="apply">
    <div class="form">
      <div class="input-wrapper label required company">
        <div>单位名称</div>
        <input type="text" placeholder="请输入" maxlength="50" v-model="companyName" @click="selectUnit" readonly/>
      </div>
      <div class="input-wrapper label required">
        <div>姓名</div>
        <input type="text" placeholder="请输入" maxlength="20" v-model="name" @click="inputClick"/>
      </div>
      <div class="input-wrapper label required">
        <div>身份证号</div>
        <input type="text" placeholder="请输入" maxlength="18" v-model="idcard" @click="inputClick"/>
      </div>
      <div class="input-wrapper label required expirydate">
        <div>有效期<check-box :color-class="'red'" :text="'长期'" :value="expirydateLong" @change="expirydateLongChange"></check-box></div>
        <div class="row">
          <input type="text" placeholder="开始日期" maxlength="8" v-model="expirydateStart" @click="openPicker('expirydateStart')" readonly/>
          <div class="zhi">-</div>
          <input type="text" placeholder="结束日期" maxlength="8" v-model="expirydateEnd" @click="openPicker('expirydateEnd')" readonly/>
        </div>
      </div>
      <div class="input-wrapper label required">
        <div>发证机关</div>
        <input type="text" placeholder="如“重庆市公安局南岸分局”" maxlength="50" v-model="idcardPolice" @click="inputClick"/>
      </div>
      <div class="select-wrapper label">
        <div>性别</div>
        <div class="right">
          <select>
            <option v-for="item in listSex" :value="item.value" v-text="item.text" :selected="item.text === sexText ? 'selected' : ''"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="input-wrapper label">
        <div>出生日期</div>
        <input type="text" placeholder="请选择" maxlength="8" v-model="birthday" @click="openPicker('birthday')" readonly/>
      </div>
      <div class="select-wrapper label">
        <div>民族</div>
        <div class="right">
          <select>
            <option v-for="item in listNation" :value="item.value" v-text="item.text" :selected="item.text === nationText ? 'selected' : ''"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="select-wrapper label">
        <div>政治面貌</div>
        <div class="right">
          <select>
            <option v-for="item in listPoliticalFace" :value="item.value" v-text="item.text" :selected="item.text === politicalFaceText ? 'selected' : ''"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="select-wrapper label">
        <div>婚姻状况</div>
        <div class="right">
          <select>
            <option v-for="item in listMarriage" :value="item.value" v-text="item.text"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="select-wrapper label required">
        <div>教育程度</div>
        <div class="right">
          <select>
            <option v-for="item in listEducation" :value="item.value" v-text="item.text" :selected="item.text === educationText ? 'selected' : ''"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="select-wrapper label required">
        <div>年收入</div>
        <div class="right">
          <select>
            <option v-for="item in listYearSalary" :value="item.value" v-text="item.text"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="textarea-wrapper label required">
        <div>详细地址</div>
        <textarea placeholder="请输入" maxlength="125" v-model="address" @click="inputClick"></textarea>
      </div>
      <div class="input-wrapper label">
        <div>邮编</div>
        <input type="text" placeholder="请输入" maxlength="6" v-model="zipcode" @click="inputClick"/>
      </div>
      <div class="select-wrapper label required">
        <div>住宅状况</div>
        <div class="right">
          <select>
            <option v-for="item in listHouseStatus" :value="item.value" v-text="item.text"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="input-wrapper label required">
        <div>手机号码</div>
        <input type="tel" placeholder="请输入" maxlength="11" v-model="mobile" @click="inputClick"/>
      </div>
      <div class="input-wrapper label">
        <div>固定电话</div>
        <input type="tel" placeholder="请输入" maxlength="11" v-model="telphone" @click="inputClick"/>
      </div>
      <div class="input-wrapper label">
        <div>电子邮箱</div>
        <input type="text" placeholder="请输入" maxlength="30" v-model="email" @click="inputClick"/>
      </div>
      <div class="input-wrapper label">
        <div>联系QQ</div>
        <input type="tel" placeholder="请输入" maxlength="20" v-model="qq" @click="inputClick"/>
      </div>
      <div class="input-wrapper label">
        <div>入职时间</div>
        <input type="text" placeholder="请选择" maxlength="8" v-model="worktime" @click="openPicker('worktime')" readonly/>
      </div>
      <div class="input-wrapper label required">
        <div>部门名称</div>
        <input type="text" placeholder="请输入" maxlength="20" v-model="department" @click="inputClick"/>
      </div>
      <div class="select-wrapper label required">
        <div>部门职务</div>
        <div class="right">
          <select>
            <option v-for="item in listDepartmentPost" :value="item.value" v-text="item.text"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="select-wrapper label">
        <div>职级</div>
        <div class="right">
          <select>
            <option v-for="item in listRank" :value="item.value" v-text="item.text"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="select-wrapper label required">
        <div>用工性质</div>
        <div class="right">
          <select>
            <option v-for="item in listNatureOfLabor" :value="item.value" v-text="item.text"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="title">亲属联系人</div>
      <div class="input-wrapper label required">
        <div>直系亲属姓名</div>
        <input type="text" placeholder="请输入" maxlength="20" v-model="familyname" @click="inputClick"/>
      </div>
      <div class="select-wrapper label required">
        <div>与本人关系</div>
        <div class="right">
          <select>
            <option v-for="item in listFamilyRelationship" :value="item.value" v-text="item.text"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="input-wrapper label required">
        <div>手机号码</div>
        <input type="tel" placeholder="请输入" maxlength="11" v-model="familymobile" @click="inputClick"/>
      </div>
      <div class="input-wrapper label">
        <div>固定电话</div>
        <input type="tel" placeholder="请输入" maxlength="11" v-model="familytelphone" @click="inputClick"/>
      </div>
      <div class="title">其他联系人</div>
      <div class="input-wrapper label required">
        <div>联系人姓名</div>
        <input type="text" placeholder="请输入" maxlength="20" v-model="contactname" @click="inputClick"/>
      </div>
      <div class="select-wrapper label required">
        <div>与本人关系</div>
        <div class="right">
          <select>
            <option v-for="item in listContactRelationship" :value="item.value" v-text="item.text"></option>
          </select>
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="input-wrapper label required">
        <div>手机号码</div>
        <input type="tel" placeholder="请输入" maxlength="11" v-model="contactmobile" @click="inputClick"/>
      </div>
      <div class="input-wrapper label">
        <div>固定电话</div>
        <input type="tel" placeholder="请输入" maxlength="11" v-model="contacttelphone" @click="inputClick"/>
      </div>
      <div class="oper">
        <a class="button red" href="javascript:;" @click.stop="postApply">提交申请</a>
      </div>
    </div>
    <mt-datetime-picker ref="picker" type="date" yearFormat="{value} 年" monthFormat="{value} 月" dateFormat="{value} 日" v-model="pickerValue" @confirm="confirmDate"></mt-datetime-picker>
    <find-account :show="findAccount.show" @selectedunit="selectedUnit" @back="backApply"></find-account>
    <apply-success :show="applySuccess.show" @backwallet="backWallet"></apply-success>
  </div>
</template>

<script>
import CheckBox from './CheckBox'
import FindAccount from './FindAccount'
import ApplySuccess from './ApplySuccess'

import { mapActions, mapGetters } from 'vuex'
import { GetDataDic, userCompany, memberInfo, GsgCardApply, myCardApply } from '../../service/apis'

export default {
  components: {
    // 复选框
    CheckBox,
    // 选择单位
    FindAccount,
    // 申请成功
    ApplySuccess
  },
  data () {
    return {
      // 选择单位
      findAccount: {
        // 是否显示
        show: false
      },
      // 申请成功
      applySuccess: {
        // 是否显示
        show: false
      },
      // 性别选项
      listSex: [{ text: '请选择', value: -1 }],
      // 性别选中项文本
      sexText: '请选择',
      // 民族选项
      listNation: [{ text: '请选择', value: -1 }],
      // 民族选中项文本
      nationText: '请选择',
      // 政治面貌选项
      listPoliticalFace: [{ text: '请选择', value: -1 }],
      // 政治面貌选中项文本
      politicalFaceText: '请选择',
      // 婚姻状况选项
      listMarriage: [{ text: '请选择', value: -1 }],
      // 教育程度选项
      listEducation: [{ text: '请选择', value: -1 }],
      // 教育程度选中项文本
      educationText: '请选择',
      // 年收入选项
      listYearSalary: [{ text: '请选择', value: -1 }, { text: '3-5万', value: 1 }, { text: '5-10万', value: 2 }, { text: '10-15万', value: 3 }, { text: '15-20万', value: 4 }, { text: '20-50万', value: 5 }, { text: '50万以上', value: 6 }],
      // 住宅状况选项
      listHouseStatus: [{ text: '请选择', value: -1 }, { text: '有房无贷', value: 1 }, { text: '有房有贷', value: 2 }, { text: '无房与父母同住', value: 3 }, { text: '单位宿舍', value: 4 }, { text: '租房', value: 5 }, { text: '其他', value: 6 }],
      // 部门职务
      listDepartmentPost: [{ text: '请选择', value: -1 }, { text: '处级以上干部', value: 1 }, { text: '科级干部', value: 2 }, { text: '股级干部', value: 3 }, { text: '科员及以下', value: 4 }, { text: '法定代表人及总经理', value: 5 }, { text: '部门经理', value: 6 }, { text: '主管', value: 7 }, { text: '职员', value: 8 }, { text: '劳务派遣及临时合同工', value: 9 }, { text: '硕士及博士在读', value: 10 }, { text: '自由职业及其他', value: 11 }],
      // 职级
      listRank: [{ text: '请选择', value: -1 }],
      // 用工性质
      listNatureOfLabor: [{ text: '请选择', value: -1 }, { text: '劳务', value: 1 }, { text: '合同', value: 2 }, { text: '编制', value: 3 }],
      // 直系亲属与本人关系
      listFamilyRelationship: [{ text: '请选择', value: -1 }, { text: '父母', value: 1 }, { text: '配偶', value: 2 }, { text: '子女', value: 3 }, { text: '兄弟姐妹', value: 4 }, { text: '其他', value: 5 }],
      // 其他联系人与本人关系
      listContactRelationship: [{ text: '请选择', value: -1 }, { text: '父母', value: 1 }, { text: '配偶', value: 2 }, { text: '子女', value: 3 }, { text: '兄弟姐妹', value: 4 }, { text: '同事', value: 4 }, { text: '朋友', value: 4 }, { text: '其他', value: 5 }],
      // 单位ID
      companyId: '',
      // 单位名称
      companyName: '',
      // 姓名
      name: '',
      // 身份证
      idcard: '',
      // 有效期开始日期
      expirydateStart: '',
      // 有效期结束日期
      expirydateEnd: '',
      // 有效期是否长期
      expirydateLong: false,
      // 发证机关
      idcardPolice: '',
      // 出生日期
      birthday: '',
      // 详细地址
      address: '',
      // 邮编
      zipcode: '',
      // 手机号码
      mobile: '',
      // 固定电话
      telphone: '',
      // 电子邮箱
      email: '',
      // 联系qq
      qq: '',
      // 入职时间
      worktime: '',
      // 部门名称
      department: '',
      // 亲属联系人直系亲属姓名
      familyname: '',
      // 亲属联系人手机号码
      familymobile: '',
      // 亲属亲属联系人固定电话
      familytelphone: '',
      // 其他联系人姓名
      contactname: '',
      // 其他联系人手机号码
      contactmobile: '',
      // 其他联系人固定电话
      contacttelphone: '',
      // 日期选择器当前选择日期
      pickerValue: new Date(),
      // 日期选择器当前选择日期操作指标
      pickerName: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'operInfo'
    ]),
    // 日期选择器最小日期
    minDate () {
      return new Date(1900, 0, 1)
    },
    // 日期选择器最大日期
    maxDate () {
      return new Date(2099, 11, 31)
    }
  },
  watch: {
    // 是否显示
    show (newValue) {
      if (newValue) {
        let _this = this
        let _app = _this.$parent.$parent
        _this.clearData()
        _this.hideFindAccount()
        _this.hideApplySuccess()
        _app.showIndicator()
        window.setTimeout(() => {
          // 改变取app注入的登录用户信息延时时间
          let _operInfo = _this.operInfo
          _operInfo.getTime = 1
          _this.setOperInfo(_operInfo)
          if (!_app.isOnline()) {
            _app.hideIndicator()
            _this.goSignin()
            return
          }
          if (_this.operInfo.isApplyed) {
            _app.hideIndicator()
            _this.showApplySuccess()
            return
          }
          _this.getMemberInfo()
        }, _this.operInfo.getTime)
      }
    },
    // 身份证
    idcard (newValue) {
      // 不允许输入非数字和x,X
      this.idcard = newValue.replace(/[^0-9xX]/g, '')
    },
    // 邮编
    zipcode (newValue) {
      // 不允许输入非数字
      this.zipcode = newValue.replace(/\D/g, '')
    },
    // 手机号码
    mobile (newValue) {
      // 不允许输入非数字
      this.mobile = newValue.replace(/\D/g, '')
    },
    // 固定电话
    telphone (newValue) {
      // 不允许输入非数字
      this.telphone = newValue.replace(/\D/g, '')
    },
    // 邮箱
    email (newValue) {
      // 不允许输入非数字和字母
      this.email = newValue.replace(/[^0-9a-zA-Z@.]/g, '')
    },
    // 联系QQ
    qq (newValue) {
      // 不允许输入非数字
      this.qq = newValue.replace(/\D/g, '')
    },
    // 亲属联系人手机号码
    familymobile (newValue) {
      // 不允许输入非数字
      this.familymobile = newValue.replace(/\D/g, '')
    },
    // 亲属联系人固定电话
    familytelphone (newValue) {
      // 不允许输入非数字
      this.familytelphone = newValue.replace(/\D/g, '')
    },
    // 其他联系人手机号码
    contactmobile (newValue) {
      // 不允许输入非数字
      this.contactmobile = newValue.replace(/\D/g, '')
    },
    // 其他联系人固定电话
    contacttelphone (newValue) {
      // 不允许输入非数字
      this.contacttelphone = newValue.replace(/\D/g, '')
    },
    // 有效期是否长期
    expirydateLong (newValue) {
      if (newValue) {
        this.expirydateStart = ''
        this.expirydateEnd = ''
      }
    }
  },
  methods: {
    ...mapActions({
      setUserInfo: 'setUserInfoSync',
      setOperInfo: 'setOperInfoSync'
    }),
    // 显示选择公司
    showFindAccount () {
      this.findAccount.show = true
    },
    // 隐藏选择公司
    hideFindAccount () {
      this.findAccount.show = false
    },
    // 显示申请成功
    showApplySuccess () {
      this.applySuccess.show = true
    },
    // 隐藏申请成功
    hideApplySuccess () {
      this.applySuccess.show = false
    },
    // 打开日期选择器
    openPicker (name) {
      this.pickerName = name
      if ((this.pickerName === 'expirydateStart' || this.pickerName === 'expirydateEnd') && this.expirydateLong) {
        return
      }
      let _value = ''
      switch (this.pickerName) {
        case 'expirydateStart':
          _value = this.expirydateStart
          break
        case 'expirydateEnd':
          _value = this.expirydateEnd
          break
        case 'birthday':
          _value = this.birthday
          break
        case 'worktime':
          _value = this.worktime
          break
      }
      if (_value === '') {
        this.pickerValue = new Date()
      } else {
        let _year = parseInt(_value.substr(0, 4))
        let _month = parseInt(_value.substr(4, 2)) - 1
        let _date = parseInt(_value.substr(6, 2))
        this.pickerValue = new Date(_year, _month, _date)
      }
      this.$refs.picker.open()
    },
    // 日期选择器确定
    confirmDate (value) {
      switch (this.pickerName) {
        case 'expirydateStart':
          this.expirydateStart = value.format('yyyyMMdd')
          break
        case 'expirydateEnd':
          this.expirydateEnd = value.format('yyyyMMdd')
          break
        case 'birthday':
          this.birthday = value.format('yyyyMMdd')
          break
        case 'worktime':
          this.worktime = value.format('yyyyMMdd')
          break
      }
    },
    // 点击输入框
    inputClick (e) {
      let _parent = document.getElementsByClassName('apply')
      if (_parent.length > 0) {
        let _app = this.$parent.$parent
        _app.focusObjParent = _parent[0]
        _app.focusObj = e.target.parentNode
      }
    },
    // 有效期是否长期改变
    expirydateLongChange (checked) {
      this.expirydateLong = checked
    },
    // 初始化数据
    initData () {
      let _this = this
      let _app = _this.$parent.$parent
      // 获取下拉选择框选项
      let _postData = {
        parentNames: '性别,民族,政治面貌,婚姻状况,学历,事业/行政职级'
      }
      GetDataDic(_postData, (err, resp) => {
        if (err) {
          _app.showNetError(err)
        } else {
          if (resp.code !== 0) {
            _app.showApiError(resp.message)
          } else {
            let _dataDic = resp.data
            _dataDic.forEach(function (item) {
              switch (item.code) {
                // 性别
                case 'SEX':
                  _this.loadSelects(_this.listSex, item.children)
                  break
                // 民族
                case 'S002':
                  _this.loadSelects(_this.listNation, item.children)
                  break
                // 政治面貌
                case 'S004':
                  _this.loadSelects(_this.listPoliticalFace, item.children)
                  break
                // 婚姻状况
                case 'MARRY_STATUS':
                  _this.loadSelects(_this.listMarriage, item.children)
                  break
                // 教育程度
                case 'EDUCATION':
                  _this.loadSelects(_this.listEducation, item.children)
                  break
                // 职级
                case 'POLITICAL_POSITION_LEVEL':
                  _this.loadSelects(_this.listRank, item.children)
                  break
              }
            })
          }
        }
      })
      window.setTimeout(() => {
        if (!_app.isOnline()) {
          return
        }
        // 判断是否已申请
        _postData = {
          tocken: _this.userInfo.token,
          plateformDeviceInfo: _app.getDeviceInfo(),
          plateformDeviceType: _app.getDeviceType(),
          userId: _this.userInfo.userId
        }
        // myCardApply(_postData, (err, resp) => {
        //   if (err) {
        //     _app.showNetError(err)
        //   } else {
        //     if (resp.code !== 0) {
        //       _app.showApiError(resp.message)
        //     } else {
        //       let _data = resp.data
        //       if (_data) {
        //         // 记录是否已申请
        //         let _operInfo = _this.operInfo
        //         _operInfo.isApplyed = true
        //         _this.setOperInfo(_operInfo)
        //       }
        //     }
        //   }
        // })
      }, _this.operInfo.getTime)
    },
    // 加载下拉选择框选项
    loadSelects (srcList, data) {
      srcList.splice(1, srcList.length - 1)
      data.forEach(function (item) {
        srcList.push({ text: item.name, value: item.code })
      })
    },
    // 获取会员信息
    getMemberInfo () {
      let _this = this
      let _app = _this.$parent.$parent
      _app.showIndicator()
      let _postData = {
        tocken: _this.userInfo.token,
        plateformDeviceInfo: _app.getDeviceInfo(),
        plateformDeviceType: _app.getDeviceType(),
        userId: _this.userInfo.userId
      }
      // 获取单位信息
      userCompany(_postData, (err, resp) => {
        // _app.hideIndicator()
        if (err) {
          _app.showNetError(err)
        } else {
          if (resp.code !== 0) {
            _app.showApiError(resp.message)
          } else {
            let _data = resp.data
            if (_data.length > 0) {
              let _unitInfo = _data[0]
              _this.companyId = _unitInfo.companyId || ''
              _this.companyName = _unitInfo.companyTitle || ''
              // 获取会员信息
              _postData = {
                tocken: _this.userInfo.token,
                plateformDeviceInfo: _app.getDeviceInfo(),
                plateformDeviceType: _app.getDeviceType(),
                companyId: _this.companyId,
                userId: _this.userInfo.userId
              }
              memberInfo(_postData, (err, resp) => {
                _app.hideIndicator()
                if (err) {
                  _app.showNetError(err)
                } else {
                  if (resp.code !== 0) {
                    _app.showApiError(resp.message)
                  } else {
                    let _data = resp.data
                    this.name = _data.userName || ''
                    this.idcard = _data.userIdCard || ''
                    this.sexText = _data.userSex || this.sexText
                    this.nationText = _data.userMinority || this.nationText
                    this.politicalFaceText = _data.userPolitical || this.politicalFaceText
                    this.educationText = _data.userEducation || this.educationText
                    this.mobile = _data.userPhone || ''
                    this.worktime = _data.companyEnterTime || ''
                    this.department = _data.companyDept || ''
                  }
                }
              })
            } else {
              _app.hideIndicator()
            }
          }
        }
      })
    },
    // 选择单位
    selectUnit () {
      this.showFindAccount()
    },
    // 选择单位 选择了单位
    selectedUnit (unit) {
      this.companyId = unit.value
      this.companyName = unit.text
      this.hideFindAccount()
    },
    // 选择单位 返回
    backApply () {
      this.hideFindAccount()
    },
    // 下拉选择框取值
    getSelect (index) {
      let _index = document.getElementsByTagName('select')[index]
      let _value = _index.options[_index.selectedIndex].text
      if (_value === '请选择') {
        return ''
      } else {
        return _value
      }
    },
    // 清空数据
    clearData () {
      this.companyId = ''
      this.companyName = ''
      this.name = ''
      this.idcard = ''
      this.expirydateStart = ''
      this.expirydateEnd = ''
      this.expirydateLong = false
      this.idcardPolice = ''
      this.birthday = ''
      this.address = ''
      this.zipcode = ''
      this.mobile = ''
      this.telphone = ''
      this.email = ''
      this.qq = ''
      this.worktime = ''
      this.department = ''
      this.familyname = ''
      this.familymobile = ''
      this.familytelphone = ''
      this.contactname = ''
      this.contactmobile = ''
      this.contacttelphone = ''
    },
    // 提交申请
    postApply () {
      let _this = this
      let _app = _this.$parent.$parent
      let _postData = {
        tocken: _this.userInfo.token,
        plateformDeviceInfo: _app.getDeviceInfo(),
        plateformDeviceType: _app.getDeviceType(),
        userId: _this.userInfo.userId,
        companyId: _this.companyId,
        companyName: _this.companyName,
        userName: _this.name,
        userIdCard: _this.idcard,
        userIdCardValidTime: _this.expirydateLong === true ? '长期' : (_this.expirydateStart + '-' + _this.expirydateEnd),
        userIdCardPolice: _this.idcardPolice,
        userSex: _this.getSelect(0),
        userBirthDay: _this.birthday,
        userMinority: _this.getSelect(1),
        userPolitical: _this.getSelect(2),
        userMarryStatus: _this.getSelect(3),
        userEducation: _this.getSelect(4),
        companySalary: _this.getSelect(5),
        userContactAddress: _this.address,
        userContactZipCode: _this.zipcode,
        userHouseType: _this.getSelect(6),
        userPhone: _this.mobile,
        userContactPhone: _this.telphone,
        userEmail: _this.email,
        userQQ: _this.qq,
        companyEnterTime: _this.worktime,
        companyDept: _this.department,
        companyPosition: _this.getSelect(7),
        companyLevelPosition: _this.getSelect(8),
        companyWordSignType: _this.getSelect(9),
        firstContact: _this.familyname,
        firstContactRelation: _this.getSelect(10),
        firstContactMobilePhone: _this.familymobile,
        firstContactPhone: _this.familytelphone,
        otherContact: _this.contactname,
        otherContactRelation: _this.getSelect(11),
        otherContactMobilePhone: _this.contactmobile,
        otherContactPhone: _this.contacttelphone
      }
      if (_postData.companyName === '') {
        _app.showToast('请输入单位名称')
        return
      }
      if (_postData.userName === '') {
        _app.showToast('请输入姓名')
        return
      }
      if (_postData.userIdCard === '') {
        _app.showToast('请输入身份证号')
        return
      }
      let _isCardID = _app.isCardID(_postData.userIdCard)
      if (!_isCardID.flag) {
        _app.showToast(_isCardID.text)
        return
      }
      if (_postData.userIdCardValidTime === '-') {
        _app.showToast('请选择有效期')
        return
      }
      if (_postData.userIdCardPolice === '') {
        _app.showToast('请输入发证机关')
        return
      }
      if (_postData.userEducation === '') {
        _app.showToast('请选择教育程度')
        return
      }
      if (_postData.companySalary === '') {
        _app.showToast('请选择年收入')
        return
      }
      if (_postData.userContactAddress === '') {
        _app.showToast('请输入详细地址')
        return
      }
      if (_postData.userHouseType === '') {
        _app.showToast('请选择住宅状况')
        return
      }
      if (_postData.userPhone === '') {
        _app.showToast('请输入手机号码')
        return
      }
      if (!_app.checkMobile(_postData.userPhone)) {
        _app.showToast('请输入正确的手机号码')
        return
      }
      if (_postData.companyDept === '') {
        _app.showToast('请输入部门名称')
        return
      }
      if (_postData.companyPosition === '') {
        _app.showToast('请选择部门职务')
        return
      }
      if (_postData.companyWordSignType === '') {
        _app.showToast('请选择用工性质')
        return
      }
      if (_postData.firstContact === '') {
        _app.showToast('请输入直系亲属姓名')
        return
      }
      if (_postData.firstContactRelation === '') {
        _app.showToast('请选择直系亲属与本人关系')
        return
      }
      if (_postData.firstContactMobilePhone === '') {
        _app.showToast('请输入亲属联系人的手机号码')
        return
      }
      if (!_app.checkMobile(_postData.firstContactMobilePhone)) {
        _app.showToast('请输入亲属联系人正确的手机号码')
        return
      }
      if (_postData.otherContact === '') {
        _app.showToast('请输入其他联系人姓名')
        return
      }
      if (_postData.otherContactRelation === '') {
        _app.showToast('请选择其他联系人与本人关系')
        return
      }
      if (_postData.otherContactMobilePhone === '') {
        _app.showToast('请输入其他联系人的手机号码')
        return
      }
      if (!_app.checkMobile(_postData.otherContactMobilePhone)) {
        _app.showToast('请输入其他联系人正确的手机号码')
        return
      }
      GsgCardApply(_postData, (err, resp) => {
        if (err) {
          _app.showNetError(err)
        } else {
          if (resp.code !== 0) {
            _app.showApiError(resp.message)
          } else {
            _this.clearData()
            _this.backTop()
            _this.showApplySuccess()
            // 记录是否已申请
            // let _operInfo = _this.operInfo
            // _operInfo.isApplyed = true
            // _this.setOperInfo(_operInfo)
          }
        }
      })
    },
    // 申请成功 返回钱包
    backWallet () {
      // 跳转钱包主页
      // window.location.href = 'http://m.goodsogood.com'
      this.$emit('gohome')
    },
    // 去登录
    goSignin () {
      this.$parent.$parent.showToast('未登录，正在跳转登录')
      window.setTimeout(() => {
        window.location.href = '//m.goodsogood.com/uc?url=' + encodeURIComponent(window.location.href + '?apply=' + true)
      }, 2700)
    },
    // 回到顶部
    backTop () {
      document.getElementById('apply').scrollTop = 0
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style scoped>
.apply {
  /*height: -webkit-calc(100% - 4.5rem);
  height: -moz-calc(100% - 4.5rem);
  height: calc(100% - 4.5rem);*/
  margin-top: 10px;
  height: 100%;
}

.apply .form .title {
  padding: 0 1rem;
  width: 100%;
  height: 4.5rem;
  line-height: 4.5rem;
  background-color: #F2F2F2;
  color: #000000;
  font-size: 1.57rem;
}

.apply .form .input-wrapper.label,
.apply .form .select-wrapper.label {
  margin-top: 0;
  height: 4.5rem;
  border-width: 0;
  border-bottom: solid 1px #F8F8F8;
}

.apply .form .textarea-wrapper.label {
  margin-top: 0;
  border-width: 0;
  border-bottom: solid 1px #F8F8F8;
}

.apply .form .input-wrapper.label input,
.apply .form .select-wrapper.label select {
  height: 2.5rem;
  line-height: 2.5rem;
}

.apply .form .textarea-wrapper.label textarea {
  height: 4.5rem;
}

.apply .form .input-wrapper.label > div:first-of-type,
.apply .form .textarea-wrapper.label > div:first-of-type,
.apply .form .select-wrapper.label > div:first-of-type {
  width: 18rem;
}

.apply .form .input-wrapper.label.required > div:first-of-type,
.apply .form .textarea-wrapper.label.required > div:first-of-type,
.apply .form .select-wrapper.label.required > div:first-of-type {
  position: relative;
}

.apply .form .input-wrapper.label.required > div:first-of-type:after,
.apply .form .textarea-wrapper.label.required > div:first-of-type:after,
.apply .form .select-wrapper.label.required > div:first-of-type:after {
  content: ' *';
  color: #E71919;
}

.apply .form .input-wrapper.company input {
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.apply .form .input-wrapper.expirydate .row {
  width: 100%;
  height: 2.5rem;
}

.apply .form .input-wrapper.expirydate .row input {
  width: 7rem;
  float: left;
}

.apply .form .input-wrapper.expirydate .row input:last-of-type {
  text-align: right;
}

.apply .form .input-wrapper.expirydate .row .zhi {
  width: .6rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  float: left;
}

.apply .form .input-wrapper.expirydate label {
  width: 5rem;
  position: absolute;
  top: .2rem;
  right: .3rem;
}
</style>
