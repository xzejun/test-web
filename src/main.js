import Vue from 'vue';
import { setToken } from 'util/request';
import { getToken } from 'util';
import app from './app.vue';
import router from './router/index';
import store from './store';
import './plugins/element';

if (process.env.NODE_ENV === 'development') {
  setToken(getToken);
  new Vue({
    router,
    store,
    render: h => h(app),
  }).$mount('#app');
}

window.addEventListener('message', e => {
  const { cmd, data = {} } = e.data || {};
  switch (cmd) {
    case 'init':
      setToken(forHeader => Promise.resolve(forHeader ? `Bearer ${data.token}` : data.token));
      store.commit('app/setData', data.state || {});
      new Vue({
        router,
        store,
        render: h => h(app),
      }).$mount('#app');
      break;
    default:
      break;
  }
});
