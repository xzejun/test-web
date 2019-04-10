import router from '../router';

export const defaultCachePrefix = '20180428_'; // 默认缓存前缀,便于快速清除缓存

const TOKEN = 'token';

/**
 * 获取token
 * @param forHeader
 * @returns {*}
 */
export function getToken(forHeader, type) {
  const token = sessionStorage[TOKEN] || localStorage[TOKEN];
  let res;
  if (token) {
    res = forHeader ? `Bearer ${token}` : token;
  } else {
    res = forHeader ? '' : token;
  }
  if (type === 'string') return res;
  return Promise.resolve(res);
}

/**
 * 保存token
 * @param token
 * @param remeber
 */
export function saveToken(token, remeber) {
  (remeber ? localStorage : sessionStorage)[TOKEN] = token;
}

/**
 * token状态
 * @returns {boolean}
 */
export function loginStatus() {
  if (!getToken()) {
    return false;
  }
  return true;
}
/**
 * 打开弹出框
 * @param {*} data  form
 */
export const setFullScreen = (isFullScreen = false) => {
  // window.top.upState({ isFullScreen });
  window.top.postMessage({ cmd: 'upState', data: { isFullScreen } }, '*');
};
/**
 * 更新标签
 * @param {*} data  form
 */
export const updateTag = data => {
  const { to } = data;
  if (process.env.NODE_ENV === 'development') {
    return router.push(to);
  }
  return window.top.postMessage({ cmd: 'updateTag', data }, '*');
};
const { config: { cdn: cdnUrl = '.' } = {} } = window;

/**
 * 静态资源cdn链接
 */
export { cdnUrl };
