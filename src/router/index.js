import VueRouter from 'vue-router';
import NotFound from '@/view/error/404';

import NetEaseView from '@/view/film/router';

// 通常情况下一个类型的界面一个路由 再在该路由下面创建一些字路由
export default new VueRouter( {
    routes: [{
        path: '*',
        component: NotFound,
    },
        ...NetEaseView,
    ]
} )
