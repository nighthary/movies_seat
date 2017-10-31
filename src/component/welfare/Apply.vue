<template>
    <div class="apply bg"
         id="apply">
        <div class="form">
            <div class="input-wrapper label required">
                <div>姓名</div>
                <input type="text" placeholder="请输入" maxlength="20" v-model="name" class="input-name"/>
            </div>
            <div class="input-wrapper label required">
                <div>身份证号</div>
                <input type="text" placeholder="请输入" maxlength="18" v-model="idcard"/>
            </div>
            <div class="label required id-card-img">
                <div class="img-picker" @click.stop="chooseImg" id="idCardFront">
                    <img src="./img/icon_pick_img.png" alt=""
                         :style="{ visibility: idCardFrontImg=='' ? 'visible' : 'hidden' }">
                    <img src="" alt="" class="idcard-front-img img"
                         :style="{ visibility: idCardFrontImg=='' ? 'hidden' : 'visible' }">
                    <p :style="{ visibility: idCardFrontImg=='' ? 'visible' : 'hidden' }">身份证正面</p>
                </div>
                <div class="img-picker" @click.stop="chooseImg" id="idCardBack">
                    <img src="./img/icon_pick_img.png" alt=""
                         :style="{ visibility: idCardBackImg=='' ? 'visible' : 'hidden' }">
                    <img src="" alt="" class="idcard-back-img img"
                         :style="{ visibility: idCardBackImg=='' ? 'hidden' : 'visible' }">
                    <p :style="{ visibility: idCardBackImg=='' ? 'visible' : 'hidden' }">身份证背面</p>
                </div>
            </div>
            <div class="input-wrapper label required">
                <div>手机号码</div>
                <input type="tel" placeholder="请输入" maxlength="11" v-model="mobile"/>
            </div>
            <div class="input-wrapper label required">
                <div>部门职务</div>
                <input type="text" placeholder="请输入" maxlength="20" v-model="department"/>
            </div>
            <div class="select-wrapper label required">
                <div>月收入</div>
                <div class="right">
                    <select>
                        <option v-for="item in listMonthSalary" :value="item.value" v-text="item.text"></option>
                    </select>
                    <i class="iconfont icon-next"></i>
                </div>
            </div>
            <div class="select-wrapper label required">
                <div>教育程度</div>
                <div class="right">
                    <select>
                        <option v-for="item in listEducation" :value="item.value" v-text="item.text"></option>
                    </select>
                    <i class="iconfont icon-next"></i>
                </div>
            </div>
            <div class="select-wrapper label required">
                <div>婚姻状况</div>
                <div class="right">
                    <select>
                        <option v-for="item in listMarriage" :value="item.value" v-text="item.text"></option>
                    </select>
                    <i class="iconfont icon-next"></i>
                </div>
            </div>
            <div class="textarea-wrapper label required">
                <div>家庭地址</div>
                <textarea placeholder="请输入" maxlength="125" v-model="address"></textarea>
            </div>
            <div class="oper">
                <a class="button red" href="javascript:;" @click.stop="postApply">下一步</a>
            </div>
        </div>
    </div>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex'
  import { GetDataDic, memberInfo, applyCzBankCard, myCardApply, getUserInfo } from '../../service/apis'

  export default {
    components: {},
    data () {
      return {
        // 婚姻状况选项
        listMarriage: [{text: '请选择', value: -1}],
        // 教育程度选项
        listEducation: [{text: '请选择', value: -1}],
        // 教育程度选中项文本
        educationText: '请选择',
        // 年收入选项
        listMonthSalary: [{text: '请选择', value: -1}],
        // 姓名
        name: '',
        // 身份证
        idcard: '',
        // 手机号码
        mobile: '',
        // 部门名称
        department: '',
        address: '',
        idCardFrontImg: '',
        idCardBackImg: '',
        postData: {
          name: '', // 用户姓名
          mobile: '', //手机号码
          identity_front_photo: '',//证件照路径：正面URL地址
          identity_back_photo: '',//证件照路径：反面URL地址
          id_card: '',//身份证号码
          gender: '',//性别;男，女
          native: '',//籍贯
          education: '',//教育程度
          dept_name: '',//所在部门
          country: '',//国籍
          marry_status: '',//婚姻状态
          province: '',//家庭所在省份
          city: '',//家庭所在市
          distinct: '',//家庭所在地区
          street: '',//家庭所在街道
          address: '',//家庭详细地址
          birthday: '',//生日
          dept_duty: '',//部门职务
          salary_month: ''//税前月薪
        }
      }
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'operInfo'
      ]),
    },
    watch: {
      // 身份证
      idcard (newValue) {
        // 不允许输入非数字和x,X
        this.idcard = newValue.replace(/[^0-9xX]/g, '')
      },
      // 手机号码
      mobile (newValue) {
        // 不允许输入非数字
        this.mobile = newValue.replace(/\D/g, '')
      },
    },
    methods: {
      ...mapActions({
        setUserInfo: 'setUserInfoSync',
        setOperInfo: 'setOperInfoSync'
      }),
      // 选择图片
      chooseImg (e) {
        let _target = e.currentTarget,
          _id = _target.id,
          _this = this,
          _app = _this.$parent.$parent
        if (typeof hostSdk !== 'undefined') {
          hostSdk.selectPic({
            type: 'base64'
          }, function (res) {
            if (res.code == 0) {
              let _url = res && res.data && res.data.url
              if ('idCardFront' === _id) {
                let _img = document.querySelector('.idcard-front-img')
                _img.src = 'data:image/png;base64,' + _url
                _this.idCardFrontImg = _url
              } else if (_id === 'idCardBack') {
                let _img = document.querySelector('.idcard-back-img')
                _img.src = 'data:image/png;base64,' + _url
                _this.idCardBackImg = _url
              }
            } else {
              _app.showApiError(res.message)
            }
          })
        }
      },
      // 初始化数据
      initData () {
        let _this = this
        let _app = _this.$parent.$parent
        // 获取下拉选择框选项
        let _postData = {
          parentNames: '婚姻状况,学历,家庭月人均收入'
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
                  // 婚姻状况
                  case 'MARRY_STATUS':
                    _this.loadSelects(_this.listMarriage, item.children)
                    break
                  // 教育程度
                  case 'EDUCATION':
                    _this.loadSelects(_this.listEducation, item.children)
                    break
                  case 'FAMILY_SALARY':
                    _this.loadSelects(_this.listMonthSalary, item.children)
                }
              })
            }
          }
        })
      },
      // 加载下拉选择框选项
      loadSelects (srcList, data) {
        srcList.splice(1, srcList.length - 1)
        data.forEach(function (item) {
          srcList.push({text: item.name, value: item.code})
        })
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
        this.name = ''
        this.idcard = ''
        this.idCardFrontImg = ''
        this.idCardBackImg = ''
        this.address = ''
        this.mobile = ''
        this.department = ''
        this.idCardFrontImg = ''
        this.idCardBackImg = ''
        document.querySelector('.idcard-back-img').src = ''
        document.querySelector('.idcard-front-img').src = ''
        this.loadSelects(this.listMarriage, [])
        this.loadSelects(this.listEducation, [])
        this.loadSelects(this.listMonthSalary, [])

        document.querySelector('.input-name').focus()
      },
      // 提交申请
      postApply () {
        let _this = this
        let _app = _this.$parent.$parent
        let _postData = {
//          tocken: _this.userInfo.token,
//          plateformDeviceInfo: _app.getDeviceInfo(),
//          plateformDeviceType: _app.getDeviceType(),
//          userId: _this.userInfo.userId,
          name: _this.name,
          mobile: _this.mobile,
          identity_front_photo: _this.idCardFrontImg,
          identity_back_photo: _this.idCardBackImg,
          id_card: _this.idcard,
          gender: _this.postData.gender,
          native: _this.postData.native,
          education: _this.getSelect(1),
          dept_name: _this.postData.dept_name,
          country: _this.postData.country,
          marry_status: _this.getSelect(2),
          address: _this.address,
          birthday: _this.postData.birthday,
          dept_duty: _this.department,
          salary_month: _this.getSelect(0),
          province: _this.postData.province,
          city: _this.postData.city,
          distinct: _this.postData.distinct,
          street: _this.postData.street
        }

        if (_postData.name === '') {
          _app.showToast('请输入姓名')
          return
        }
        if (_postData.id_card === '') {
          _app.showToast('请输入身份证号')
          return
        }
        let _isCardID = _app.isCardID(_postData.id_card)
        if (!_isCardID.flag) {
          _app.showToast(_isCardID.text)
          return
        }
        if (_postData.identity_front_photo === '') {
          _app.showToast('请上传身份证正面图片')
          return
        }
        if (_postData.identity_back_photo === '') {
          _app.showToast('请上传身份证背面图片')
          return
        }
        if (_postData.mobile === '') {
          _app.showToast('请输入手机号码')
          return
        }
        if (!_app.checkMobile(_postData.mobile)) {
          _app.showToast('请输入正确的手机号码')
          return
        }
        if (_postData.dept_duty === '') {
          _app.showToast('请输入部门职务')
          return
        }
        if (_postData.salary_month === '') {
          _app.showToast('请选择月收入')
          return
        }
        if (_postData.education === '') {
          _app.showToast('请选择教育程度')
          return
        }
        if (_postData.marry_status === '') {
          _app.showToast('请选择婚姻状况')
          return
        }
        if (_postData.address === '') {
          _app.showToast('请输入详细地址')
          return
        }

        _app.showIndicator()
        applyCzBankCard(_postData, (err, resp) => {
          if (err) {
            _app.showNetError(err)
          } else {
            if (Number(resp.code) !== 0) {
              _app.showApiError(resp.msg)
            } else {
              _app.hideIndicator()
              _this.clearData()
              hostSdk.openSpecifyUrl({
                openUrl: resp.data,
                doFn: `setIdentityPhoto("data:image/png;base64,${_this.idCardFrontImg}","data:image/png;base64,${_this.idCardBackImg}")`
              })
//              window.location.href = resp.data
            }
          }
        })
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
      },
      getUserInfo () {
        let _this = this,
          _app = this.$parent.$parent

        _app.showIndicator()
        let _data = {
          tocken: _this.userInfo.token,
          plateformDeviceInfo: _app.getDeviceInfo(),
          plateformDeviceType: _app.getDeviceType(),
          userId: _this.userInfo.userId
        }
        getUserInfo(_data, (err, resp) => {
          if (err) {
            _app.showNetError(err)
          } else {
            if (Number(resp.code) !== 0) {
//              _app.showApiError(resp.message)
            } else {
//              _this.setUserInfo(resp.data)
              _this.setUserInfoTest(resp.data)
              _app.hideIndicator()
            }
          }
          _app.hideIndicator()
        })
      },
      setUserInfoTest () {
        var users =
          [
            {
              'birthday': '19590313',
              'country': '中国',
              'education': '硕士',
              'address': '北京市东城区机场路88号-2-6',
              'gender': '男',
              'city': '市辖区',
              'mobile': '18623647680',
              'id_card': '110101198403225161',
              'marry_status': '未婚',
              'dept_name': '产品中心',
              'distinct': '东城区',
              'salary_month': '10000',
              'province': '北京市',
              'native': '北京市东城区',
              'street': '家庭所在街道',
              'name': '蒋群龙'
            },
            {
              'birthday': '19590313',
              'country': '中国',
              'education': '硕士',
              'address': '北京市东城区机场路88号-2-6',
              'gender': '男',
              'city': '市辖区',
              'mobile': '18623647680',
              'id_card': '110101198403225161',
              'marry_status': '未婚',
              'dept_name': '产品中心',
              'distinct': '东城区',
              'salary_month': '10000',
              'province': '北京市',
              'native': '北京市东城区',
              'street': '家庭所在街道',
              'name': '蒋群龙'
            },
              {
                'birthday': '20030920',
                'country': '中国',
                'education': '硕士',
                'address': '北京市东城区城武大厦20号-14-7',
                'gender': '男',
                'city': '市辖区',
                'mobile': '18623647680',
                'id_card': '019660712942 ',
                'marry_status': '未婚',
                'dept_name': '产品中心',
                'distinct': '东城区',
                'salary_month': '10000',
                'province': '北京市',
                'native': '北京市东城区',
                'street': '家庭所在街道',
                'name': '钱星'
              },
            {
              'birthday': '19590313',
              'country': '中国',
              'education': '硕士',
              'address': '北京市东城区机场路88号-2-6',
              'gender': '男',
              'city': '市辖区',
              'mobile': '18623647680',
              'id_card': '110101198403225161',
              'marry_status': '未婚',
              'dept_name': '产品中心',
              'distinct': '东城区',
              'salary_month': '10000',
              'province': '北京市',
              'native': '北京市东城区',
              'street': '家庭所在街道',
              'name': '蒋群龙'
            },
              {
                'birthday': '20030920',
                'country': '中国',
                'education': '硕士',
                'address': '北京市东城区城武大厦20号-14-7',
                'gender': '男',
                'city': '市辖区',
                'mobile': '18623647680',
                'id_card': '019660712942 ',
                'marry_status': '未婚',
                'dept_name': '产品中心',
                'distinct': '东城区',
                'salary_month': '10000',
                'province': '北京市',
                'native': '北京市东城区',
                'street': '家庭所在街道',
                'name': '钱星'
              },
              {
                'birthday': '19520310',
                'country': '中国',
                'education': '高中',
                'address': '北京市东城区风岗街99号-19-1',
                'gender': '女',
                'city': '市辖区',
                'mobile': '18623647680',
                'id_card': '110100200809243355',
                'marry_status': '未婚',
                'dept_name': '产品中心',
                'distinct': '东城区',
                'salary_month': '10000',
                'province': '北京市',
                'native': '北京市东城区',
                'street': '家庭所在街道',
                'name': '柏素'
              },
              {
                'birthday': '19590313',
                'country': '中国',
                'education': '硕士',
                'address': '北京市东城区机场路88号-2-6',
                'gender': '男',
                'city': '市辖区',
                'mobile': '18623647680',
                'id_card': '110101198403225161',
                'marry_status': '未婚',
                'dept_name': '产品中心',
                'distinct': '东城区',
                'salary_month': '10000',
                'province': '北京市',
                'native': '北京市东城区',
                'street': '家庭所在街道',
                'name': '蒋群龙'
              },
              {
                'birthday': '20030920',
                'country': '中国',
                'education': '硕士',
                'address': '北京市东城区城武大厦20号-14-7',
                'gender': '男',
                'city': '市辖区',
                'mobile': '18623647680',
                'id_card': '019660712942 ',
                'marry_status': '未婚',
                'dept_name': '产品中心',
                'distinct': '东城区',
                'salary_month': '10000',
                'province': '北京市',
                'native': '北京市东城区',
                'street': '家庭所在街道',
                'name': '钱星'
              },
              {
                'birthday': '19520310',
                'country': '中国',
                'education': '高中',
                'address': '北京市东城区风岗街99号-19-1',
                'gender': '女',
                'city': '市辖区',
                'mobile': '18623647680',
                'id_card': '110100200809243355',
                'marry_status': '未婚',
                'dept_name': '产品中心',
                'distinct': '东城区',
                'salary_month': '10000',
                'province': '北京市',
                'native': '北京市东城区',
                'street': '家庭所在街道',
                'name': '柏素'
              },
              {
                'birthday': '19901117',
                'country': '中国',
                'education': '硕士',
                'address': '北京市东城区奉化街83号-1-1',
                'gender': '男',
                'city': '市辖区',
                'mobile': '18623647680',
                'id_card': '110101195704175088',
                'marry_status': '未婚',
                'dept_name': '产品中心',
                'distinct': '东城区',
                'salary_month': '10000',
                'province': '北京市',
                'native': '北京市东城区',
                'street': '家庭所在街道',
                'name': '俞健'
              }]
        var data = users[Math.floor(Math.random()*10+1)];
        Object.assign(this.postData, data)
      },
      setUserInfo (data) {
        this.postData.gender = data.userSex || ''
        this.postData.native = data.userNativePlace || ''
        this.postData.country = data.userNation || ''
        this.postData.province = data.userHomeProvince || ''
        this.postData.city = data.userHomeCity || ''
        this.postData.distinct = data.userHomeDistinct || ''
        this.postData.street = data.userHomeStreet || ''
        this.postData.birthday = data.birthday || ''
        this.postData.dept_name = data.userOrgnization || ''
      }
    },
    mounted () {
      this.initData()
      this.getUserInfo()
    }
  }
</script>

<style scoped>
    .apply {
        /*height: -webkit-calc(100% - 4.5rem);
        height: -moz-calc(100% - 4.5rem);
        height: calc(100% - 4.5rem);*/
        padding-top: 10px;
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

    .id-card-img {
        position: relative;
        padding: 1rem 10px;
        height: 10rem;
    }

    .img-picker {
        padding: 1.5rem 0;
        border: 1px solid #FFF;
        background-color: #fff;
        position: absolute;
        width: 47%;
        /* height: 12rem; */
        text-align: center;
        font-size: 1.3rem;
    }

    .img-picker img {
        width: 3rem
    }

    .img-picker input {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        top: 0;
        opacity: 0;
    }

    .img-picker:last-child {
        float: right;
        position: relative;
    }

    .img-picker .img {
        position: absolute;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
    }
</style>
