import * as types from './mutation-types'

/**
 *管理持久化开发
 * @author chuans
 */

// 保存类型，吧需要保存的动作放到数组里面，然后每次修改保存到本地
// 长期保存，除非用户清除浏览器数据
// 一般情况，用来保存一些短时间不可变的数据  例如列表分类，地理位置（市）等
const LocalStorageList = [];

// session保存 关闭清除数据
// 用来保存一般数据
const SessionoStorage = [
    types.SAVE_OPEN_ID,
    types.SAVE_ORDER_CARD_INFO,
    types.SAVE_ORDER_PAY_TYPE,
    types.SAVE_CARD_DETAIL,
    types.SAVE_HEADER_INFO,
];


export default function ( store ) {

    // 统一处理赋值操作
    const assignVal = ( key, value ) => {
        console.log( key, value )
        // 处理当获取出来的值有可能是undefined 处理JSON报错的问题
        value = JSON.parse( value === 'undefined' ? 'null' : value );

        // 如果存在则赋值
        if ( value !== null && value !== 'undefined' ) {
            store.commit( key, value );
        }
    }

    // 初始化的时候 加载LocalStorage数据并赋值
    LocalStorageList.map( val => {
        assignVal( val, localStorage.getItem( `mutation:${val}` ) );
    } )

    // 初始化的时候 加载SessionoStorage数据并赋值
    SessionoStorage.map( val => {
        assignVal( val, sessionStorage.getItem( `mutation:${val}` ) );
    } )

    // 监控 mutaion的的变化 赋值
    store.subscribe( ( mutation ) => {
        // 执行 LocalStorageList 保存
        if ( LocalStorageList.indexOf( mutation.type ) !== -1 ) {
            console.log( `save localStorage  mutation:${mutation.type} - ${mutation.payload}` );

            localStorage.setItem( `mutation:${mutation.type}`, JSON.stringify( mutation.payload ) );
        }

        // 执行 SessionStorageList 保存
        if ( SessionoStorage.indexOf( mutation.type ) !== -1 ) {
            console.log( `save sessionStorage  mutation:${mutation.type} - ${mutation.payload}` );

            sessionStorage.setItem( `mutation:${mutation.type}`, JSON.stringify( mutation.payload ) );
        }

    } )
}