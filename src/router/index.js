import Vue from 'vue';
import Router from 'vue-router';
import { getToken } from 'util';
import routes from './routers';

Vue.use(Router);
const router = new Router({
  routes,
});
// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  if (process.env.NODE_ENV === 'development') {
    getToken().then(token => {
      if (!token && to.path !== '/login') {
        next('/login');
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

export default router;
