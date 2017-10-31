// 保存实例化后的构造函数
var jsBridge = null;

// 前端sdk方法
window.hostSdk = {

  //初始化回调队列
  queueCallback: [],

  init: function ( callback ) {
    //先判断当前客户端是否初始化完成 如果没有完成 则吧当前的callback加入到队列 待加载完成后调用
    if ( !window.host_sdk.initialized ) {
      window.hostSdk.queueCallback.push( callback );
    } else {
      callback();
    }
  },

  // 当客户端加载完成后调用前端初始化
  onInit: function () {
    jsBridge = new window.GoodSoGoodJSBridge();
    //处理回调队列

    for ( var i = 0 ; i < window.hostSdk.queueCallback.length ; i++){
      if ( typeof window.hostSdk.queueCallback[i] === 'function' ) {
        window.hostSdk.queueCallback[i]( window.hostSdk );
      }
    }


  },
  //关闭当前页面
  closePage: function () {
    if ( jsBridge ) {
      jsBridge.closePage();
    }
  },
  //打开分享界面
  openShare: function ( info,cb ) {
    if ( jsBridge ) {
      jsBridge.openShare(info, function ( result ) {
        hostSdk.getObjectParams( result, cb );
      } );
    }
  },
  //获取位置
  getLocation: function ( cb ) {
    if ( jsBridge ) {
      jsBridge.getLocation( function ( result ) {
        hostSdk.getObjectParams( result, cb );
      } );
    }
  },
  //获取用户信息
  getUserInfo: function ( cb ) {
    if ( jsBridge ) {
      jsBridge.getUserInfo( function ( result ) {
        hostSdk.getObjectParams( result, cb );
      } );
    }
  },
  //选择图片
  // { type: 'base64' || 'url' }
  selectPic: function ( params, cb ) {
    if(typeof params === 'function') {
      cb = params;
      params = {};
    }

    if ( jsBridge ) {
      jsBridge.selectPic(params, function ( result ) {
        hostSdk.getObjectParams( result, cb );
      } );
    }
  },
  //充值
  recharge: function ( cb ) {
    if ( jsBridge ) {
      jsBridge.recharge( function ( result ) {
        hostSdk.getObjectParams( result, cb );
      } );
    }
  },
  //打开扫一扫
  scan: function ( cb ) {
    if ( jsBridge ) {
      jsBridge.scan( function ( result ) {
        hostSdk.getObjectParams( result, cb );
      } );
    }
  },
  //打开wifi
  openWIFI: function () {
    if ( jsBridge ) {
      jsBridge.openWIFI();
    }
  },
  //打开蓝牙
  openBluetooth: function () {
    if ( jsBridge ) {
      jsBridge.openBluetooth();
    }
  },
  //打开我的积分界面
  openIntegralView: function () {
    if ( jsBridge ) {
      jsBridge.openIntegralView();
    }
  },
  //设置是否显示加载动画
  setLoading: function ( state ) {
    if ( state ) {
      //window.GSJSBridge.show();
      if ( jsBridge ) jsBridge.show();
    } else {
      //window.GSJSBridge.hide();
      if ( jsBridge ) jsBridge.hide();
    }
  },

  enterRnPage: function ( message ) {
    if ( jsBridge ) jsBridge.enterRnPage( message );
  },

  // 直接打开原生支付界面（传入payData）
  pay : function(payData,cb){
    if ( jsBridge ) {
      jsBridge.pay( payData, function ( resultPay ) {
        hostSdk.getObjectParams( resultPay, cb );
      } )
    }
  },

  //预支付
  payOrder: function ( cb ) {
    var info = {
        storeId: '4B4ACB19853E4FFA8ED37684C435B0AF',            // 分店ID
        merchantId: 'A1E556F63577412F99EBAF028AEFC56B',     // 商户ID
        openId: '',         // 会员openId
        orderFee: 100,           //订单金额,单位：分
        noDiscountFee: 0,         //不打折金额,单位：分

        deviceInfo: 1,           //客户端的设备信息
        platform: 1,           //支付平台 1 微信 2 APP

        title: '线下扫码标题',          //支付的标题
        body: '线下扫码内容',           //支付的内容
      },
      apiMap = 'http://merchant.goodsogood.com/merchant/merchant/scanPay/preOrder';

    $.ajax( {
      type: "post",
      url: apiMap,
      data: info,
      success: function ( msg ) {
        // 返回显示数据
        msg = hostSdk.getObjectParams( msg );
        if ( parseInt( msg.code ) === 0 && msg.data.payData ) {
          if ( jsBridge ) {
            console.log( '接口payData：' + msg.data.payData )
            jsBridge.pay( msg.data.payData, function ( resultPay ) {
              hostSdk.getObjectParams( resultPay, cb );
            } )
          }
        }
      },
      error: function ( err ) {
        console.log( err );
      }
    } );
    //获取用户数据
    if ( jsBridge ) jsBridge.getUserInfo( function ( result ) {
      result = hostSdk.getObjectParams( result );
      info.openId = /*'79cc748bd2a717cbb770a1ba22fb091d' ||*/ result.data.openId;
      $.ajax( {
        type: "post",
        url: apiMap,
        dataType: "jsonp",
        jsonp: 'callback',
        data: info,
        success: function ( msg ) {
          // 返回显示数据
          msg = hostSdk.getObjectParams( msg );
          if ( parseInt( msg.code ) === 0 && msg.data.payData ) {
            if ( jsBridge ) {
              console.log( '接口payData：' + msg.data.payData )
              jsBridge.pay( msg.data.payData, function ( resultPay ) {
                hostSdk.getObjectParams( resultPay, cb );
              } )
            }
          }
        },
        error: function ( err ) {
          console.log( err );
        }
      } );
    } );
  },

  /**
   * 打开指定URL并在页面加载完成之后执行指定JS
   * @param  {[type]}   params [需要执行的JS]
   * {
     *   dofn: ''
     * }
   */
  openSpecifyUrl: function (params, cb) {
    if ( jsBridge ) {
      jsBridge.openSpecifyUrl( params, function ( result ) {
        window.alert(result)
        hostSdk.getObjectParams( result, cb );
      } )
    }
  },

  /**
   * 返回一个对象参数
   * @param { string | object } params        需要转换的源数据
   * @param { function } [cb]                   是否有回调
   */
  getObjectParams: function ( params, cb ) {

    // 判断是否是一个字符串JSON   并且包含 { 或者 }
    if ( (typeof params === 'string') && (params.indexOf( '{' ) > -1) ) {

      params = JSON.parse( params )

      cb && cb( params )

      return params;

      // 判断是否是一个对象
    } else if ( typeof params === 'object' ) {

      cb && cb( params );

      return params;

      //如果以上都不是  则认为是一个普通字符串
    } else {
      cb && cb( params );
      return '';
    }
  },
}

// 客户端回调方法
window.host_sdk = {

  // 设置当前初始化是否已经完成
  initialized: false,

  // 生命周期方法  加载初始化(完成)
  onInit: function () {
    // 设置加载完成状态
    window.host_sdk.initialized = true;
    // 调用前端初始化
    if ( hostSdk.onInit ) hostSdk.onInit();
  }
}

