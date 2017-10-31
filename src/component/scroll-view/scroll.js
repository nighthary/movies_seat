import touchEvent from '../../util/touch';

/**
 * scrollViewContainer 滚动组件
 * @param { element } warp            // 最外层框
 * @param { element } warpContent     // 主体内容
 */
const defaultFunc = () => {
    console.log( 'touch start!' );
};

export const state = {
    // 准备阶段 无任何操作
    NORMAL: 0,
    // 开始点击
    START: 1,
    // 滑动中
    MOVE: 2,
    // 滑动结束手指移开
    END: 3,
};


export default class scrollViewContainer {
    constructor( props ) {
        this.props = props;
        this.touchState = state.NORMAL;
        this.init();
    }

    init() {
        const { warp, warpContent, touchStart = defaultFunc, touchEnd = defaultFunc, touchMove = defaultFunc, stateUpdate = defaultFunc } = this.props;

        let touch = new touchEvent( warp );

        touch.start( ( x, y, startTime ) => {
            this.touchState = state.START;

            touchStart( x, y, startTime );
            stateUpdate( this.touchState );
        } );
        touch.move( ( x, y ) => {
            this.touchState = state.MOVE;

            touchMove( x, y );
            stateUpdate( this.touchState );
        } );
        touch.end( ( x, y, endTime ) => {
            this.touchState = state.END;

            touchEnd( x, y, endTime );
            /**
             * stateUpdate 每次改变状态调用 如果是结束手指弹开则存在第二个 重置状态的方法
             */
            stateUpdate( this.touchState, this.resetState );
        } );
    }

    resetState() {
        this.touchState = state.NORMAL;
        this.props.stateUpdate( this.touchState );
    }
}