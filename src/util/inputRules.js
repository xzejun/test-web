import _ from 'lodash';

/**
 * 必填项的校验规则  因为加入了自定义规则，所以前边必填的*不会显示
 * @param message 提示信息
 * @param type 必填项的类型,默认为字符串
 */
export function isRequired(message = '必填项', type = 'string') {
  if (type === 'string') {
    // 字符串需要判断空格错误
    const requiredRule = (rule, value, callback) => {
      const v = _.trim(value);
      if (v === '') {
        callback(message);
      } else {
        callback();
      }
    };
    return {
      required: true,
      validator: requiredRule,
    };
  }
  return {
    required: true,
    // whitespace: true, // TODO element 组件好像没有生效
    message,
    type,
  };
}

/**
 * 长度限制的校验规则
 * @param min 下限, 默认为1
 * @param max 上限, 默认为16
 */
export function lengthRule(min = 1, max = 16) {
  return {
    min,
    max,
    message: `请输入${min}-${max}位字符`,
  };
}

export function phone(message = '请输入合法的手机号码') {
  return {
    pattern: /^1\d{10}$/,
    message,
  };
}

/**
 * 验证手机号码和固定号码
 * @param message
 * @returns {{pattern: RegExp, message: string}}
 */
export function phoneAndTel(message = '请输入合法的手机号码或固定号码') {
  return {
    pattern: /^(1\d{10}|0\d{2,3}-\d{7,8})$/,
    message,
  };
}

/**
 * 仅含有数字的校验规则
 * @param message 提示信息
 */
export function intOnly(message = '请输入数字') {
  return {
    min: 1,
    max: 99999999999,
    required: true,
    type: 'number',
    //  pattern: /^([0-9]*)$/,
    message,
  };
}

/**
 * 仅含有大小写字母的校验规则
 * @param message 提示信息
 */
export function letterOnly(message = '请输入大写或小写字母') {
  return {
    pattern: /^[A-Za-z]*$/,
    message,
  };
}

/**
 * 仅含有大小写字母和数字的校验规则
 * @param message 提示信息
 */
export function alphanumOnly(message = '请输入数字或大小写字母的组合') {
  return {
    pattern: /^[A-Za-z0-9]*$/,
    message,
  };
}

/**
 * 仅含有汉字(Chinese character)的校验规则
 * @param message 提示信息
 */
export function ccOnly(message = '请输入汉字') {
  return {
    pattern: /^[\u4e00-\u9fa5]*$/,
    message,
  };
}

/**
 * 仅含有汉字, 大小写字母和数组的校验规则
 * @param message 提示信息
 */
export function ccAlphanumOnly(message = '请输入汉字、数字或大小写字母的组合') {
  return {
    pattern: /^[A-Za-z0-9\u4e00-\u9fa5]*$/,
    message,
  };
}

/**
 * IPv4地址校验规则
 * @param message 提示信息
 */
export function ipv4(message = '请输入合法的IPv4地址') {
  return {
    pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message,
  };
}

/**
 * 异步校验规则
 */
export const validator = (fn, msg, args) => (rule, value, callback) => {
  fn({ value, ...args }).then(({ data }) => {
    if (data) {
      callback(_.isFunction(msg) ? msg(value) : msg);
    } else {
      callback();
    }
  });
};

/**
 * 异步校验规则 如果 不 存在触msg
 */
export const validatorNoExist = (fn, msg, args) => (rule, value, callback) => {
  fn({ value, ...args }).then(({ data }) => {
    if (!data) {
      callback(_.isFunction(msg) ? msg(value) : msg);
    } else {
      callback();
    }
  });
};

/**
 * 仅含有数字字母和特殊字符校验规则
 * @param message 提示信息
 */
export function password(message = '请输入数字字母和字符中的一种或多种') {
  return {
    pattern: /^[a-zA-Z0-9~`!@#$%^&*()_+|}{":?></.,';\][=-]{6,16}$/,
    message,
  };
}

/**
 * 邮箱校验规则
 * @param message 提示信息
 */
export function email(message = '请输入正确的邮箱地址') {
  return {
    pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    message,
  };
}

/**
 * 座位数
 * @param message 提示信息
 */
export function num(message = '请输入整数') {
  return {
    pattern: /^([0-9]*)$/,
    message,
  };
}

/**
 * 座位数
 * @param message 提示信息
 */
export function schoolNum(message = '请输入字目或数字') {
  return {
    pattern: /^([a-zA-Z0-9]*)$/,
    message,
  };
}
