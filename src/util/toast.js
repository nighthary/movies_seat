/**
 * EUI   Toast 插件
 * @author chuans
 * @example
 *
 * import   --->   import Toast from 'toast';
 * call     --->   Toast.show({msg:'我是谁',time:3000})
 *
 */
export default {
    el: document.querySelector( '#toast-ui' ),

    show: function ( options ) {
        let box,
            translate = options.place==='center'?'translate(-50%,-50%)':'translateX(-50%)',
            showStyle = `-webkit-transform: ${translate} scale(1);transform: translateX(-50%) scale(1);opacity:1;`,
            hideStyle = `-webkit-transform: ${translate} scale(0);transform: translateX(-50%) scale(0);opacity:0;`;

        options = Object.assign( {
            place: 'top',        //提示框的位置。总共7个值：center(默认值) top topLeft topRight bottom bottomLeft bottomRight
            msg: '',                //提示框的文本。
            time: '',                //提示框自动消失的时间
        }, options, );


        if ( this.el ) {
            this.el.innerHTML = options.msg;
            setTimeout( () => {
                this.el.style.cssText = showStyle
            }, 1 )

        } else {
            box = this._createDom( options );
            box.innerHTML = options.msg;
            document.body.appendChild( box );
            setTimeout( () => {
                box.style.cssText = showStyle
            }, 1 )
        }


        if ( options.time ) {
            setTimeout( () => {
                this.el ? this.el.style.cssText = hideStyle : box.style.cssText = hideStyle;
            }, options.time );
        }
    },

    hide: function () {
        this.el.className = 'hide';
    },

    _createDom( options ){
        if ( this.el ) return this.el;

        let div = this.el = document.createElement( 'div' ),
            style = document.createElement( 'style' ),
            position = '';

        switch ( options.place ) {
            case 'top' :
                position = 'top:100px;left:50%;-webkit-transform: translateX(-50%) scale(0);transform: translateX(-50%) scale(0);';
                break;
            case 'center' :
                position = 'top:50%;left:50%;-webkit-transform: translate(-50%,-50%) scale(0);transform: translate(-50%,50%) scale(0);';
                break;
            case 'bottom' :
                position = 'bottom:100px;left:50%;-webkit-transform: translateX(-50%) scale(0);transform: translateX(-50%) scale(0);';
                break;
        }
        div.id = 'toast-ui';
        div.className = `toast-ui-warp`;
        style.innerHTML = `.toast-ui-warp{position:fixed;${position}max-width:80%;background:rgba(0,0,0,.75);color:rgba(255,255,255,.9);font-size:14px;line-height:20px;padding:7px 20px;border-radius:8px;display:block;-webkit-transition:all .2s cubic-bezier(.175,.885,.32,1.275);transition:all .2s cubic-bezier(.175,.885,.32,1.275);text-align:center;}`;

        document.head.appendChild( style );

        return div;
    },
};
