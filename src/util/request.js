import uri from 'url';
import fetch from 'isomorphic-fetch';
import { extend, isObjectLike, isArrayLike, forEach, startsWith, split, reduce } from 'lodash';

const credentials = 'include'; // include/same-origin
const CONTENT_TYPE = 'Content-Type';
const JSON_TYPE = 'application/json';

// 后台API URI前端
const { config: { api: apiUrl = './api' } = {} } = window;
// token获取方法
let getToken;

/**
 * api配置地址
 */
export const getApiUrl = () => apiUrl;

/**
 * 设置获取token的方法，以便AJAX请求时添加到header
 * @param token_getter token获取方法
 */
export function setToken(tokenGetter) {
  getToken = tokenGetter;
  if (typeof tokenGetter === 'string') {
    getToken = () => Promise.resolve(tokenGetter);
  }
}
/**
 * 默认http选项
 * @type {{headers: {}}}
 */
const DefaultOptions = {
  headers: {
    [CONTENT_TYPE]: JSON_TYPE,
  },
  credentials,
};
/**
 * 获取响应结果的媒体类型（Content-Type）
 * @param res 响应结果
 * @return Content-Type字符串
 */
export function getType(res) {
  return res.headers.get(CONTENT_TYPE);
}

/**
 * 判断结果是否为JSON格式
 * @param res 响应结果
 * @param type 原始Content-Type字符串
 */
export function isJson(res, type) {
  type = type || getType(res);
  if (type && type.indexOf('json') > -1) {
    res.isJson = true;
    return true;
  }
  return false;
}

/**
 * 判断结果是否为文本格式
 * @param res 响应结果
 * @param type 原始Content-Type字符串
 */
export function isText(res, type) {
  type = type || getType(res);
  if (type && (type.indexOf('text') > -1 || type.indexOf('plain') > -1)) {
    res.isText = true;
    return true;
  }
  return false;
}

/**
 * 解析AJAX响应结果
 * @param res 响应结果
 * @returns {JSON|string} 根据媒体类型返回JSON对象或文本内容
 */
export function parseResponse(res) {
  const body = isJson(res) ? res.json() : res.text();
  return body.then(data => ({ res, data }));
}

/**
 * 解析AJAX响应结果
 * @param res 响应结果
 * @returns {{status, message}} 错误对象
 */
function parseError(res) {
  const error = {};
  if (typeof res === 'object') {
    let stage = 0;
    forEach(res, (value, key) => {
      if (stage !== 2) {
        switch (key) {
          case 'code':
          case 'status':
            if (typeof value === 'number') {
              error.status = value;
              ++stage;
            }
            break;
          case 'text':
          case 'message':
          case 'statusText':
            if (typeof value === 'string') {
              error.message = value;
              ++stage;
            }
            break;
          default:
            break;
        }
      }
    });
  } else if (typeof res === 'string') {
    error.message = res;
  }
  return error;
}

/**
 * 检测AJAX返回状态码
 * @param result 响应解析结果
 * @returns {res} 如不在[200,300]之间则抛出错误对象（{status,message}）
 */
export function checkStatus(result) {
  const { res, data } = result;
  if (res.ok) {
    return result;
  }
  let err = {};
  if (res.isJson) {
    err = parseError(data);
  } else if (isText(res)) {
    err.message = data;
  }
  if (!err.status) {
    err.status = res.status;
  }
  if (!err.message) {
    err.message = res.statusText;
  }
  return { err };
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // 添加默认选项
  options = extend({}, DefaultOptions, options || {});
  return getToken(true).then(token => {
    if (token) {
      if (!options.headers) {
        options.headers = {};
      }
      options.headers.Authorization = token;
    }

    const hashArray = split(window.location.hash, '?');
    if (hashArray[1]) {
      const query = reduce(
        split(hashArray[1], '&'),
        (res, q) => {
          const [key, value] = split(q, '=');
          res[key] = value;
          return res;
        },
        {},
      );
      const { schoolId, studentId } = query;
      if (schoolId) {
        if (!options.headers) {
          options.headers = {};
        }
        options.headers.schoolId = schoolId;
      }
      if (studentId) {
        if (!options.headers) {
          options.headers = {};
        }
        options.headers.studentId = studentId;
      }
    }
    let uriObj;
    if (options.body) {
      switch (options.method) {
        case 'get':
        case 'delete': // delete中body会被忽略
          uriObj = uri.parse(url);
          uriObj.query = extend(uriObj.query, options.body);
          url = uri.format(uriObj);
          delete options.body;
          break;
        default:
          break;
      }

      // 请求json文件格式则自动转换body
      if (
        options.body &&
        (isObjectLike(options.body) || isArrayLike(options.body)) &&
        options.headers &&
        options.headers[CONTENT_TYPE] === 'application/json'
      ) {
        options.body = JSON.stringify(options.body);
      }
    }
    const fullUrl =
      url && (url.indexOf('//') === 0 || url.indexOf('http://') === 0 || url.indexOf('https://') === 0)
        ? url
        : `${apiUrl}${startsWith(url, '/') ? url : `/${url}`}`;
    return fetch(fullUrl, options)
      .then(parseResponse)
      .then(checkStatus)
      .catch(err => ({ err }));
  });
}

export const createMethod = (method, api = '', error) => (url, data, options) => {
  const fullUrl = `${api}${url}`;
  const p = request(fullUrl, { method, body: data, ...options });
  if (error) {
    p.then(res => {
      if (res.err) {
        error({
          fullUrl,
          data,
          options,
          err: res.err,
        });
      }
      return res;
    });
  }
  return p;
};

export const createMethods = (...args) => ({
  get: createMethod('get', ...args),
  post: createMethod('post', ...args),
  del: createMethod('delete', ...args),
  put: createMethod('put', ...args),
});

export const get = createMethod('get');

export const post = createMethod('post');

export const del = createMethod('delete');

export const put = createMethod('put');
