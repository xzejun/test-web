import _ from 'lodash';

const state = {
  name: 'app',
  user: {},
  appDict: {},
  schoolDict: {},
};
const getters = {};
const actions = {};
const mutations = {
  setData(state, payload) {
    const { appDict, schoolDict, user } = payload;
    _.forEach({ appDict, schoolDict, user }, (v, k) => {
      _.set(state, k, v);
    });
  },
  upState(state, payload) {
    _.forEach(payload, (v, k) => {
      _.set(state, k, v);
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
