import _ from 'lodash';
import { get, post, put } from 'util/request';

// 账户api
const userApiUrl = '/base/user';

/**
 * [账户] 获取
 * @param {*}args
 */
export const appUserGet = args => {
  const { userIds, ...arg } = args;
  const where = [];
  where.push({
    whereIn: ['user.id', userIds],
  });
  return get(userApiUrl, { _where: JSON.stringify(where), ...arg });
};
/**
 * 项目列表
 * @param {*} args
 * */
export const projectGet = args => {
  const where = [{ whereNot: { status: 'd' } }];
  return get('/datamapping/project', { _where: JSON.stringify(where), ...args });
};
/**
 * 项目添加
 * @param {*} data
 * */
export const projectAdd = data => post('/datamapping/project', data);
/**
 * 项目编辑
 * @param {*} data
 * */
export const projectEdit = data => put('/datamapping/project', data);
/**
 * 项目删除
 * @param {*} data
 * */
export const projectDel = data => put('/datamapping/projectDel', data);
/**
 * [数据类型]查询
 * @param {*} args
 * */
export const projectDataTypeGet = args => get('/datamapping/datatype', args);
/**
 * 查看项目
 * @param {*} args
 * */
export const projectStatusGet = args => get('/datamapping/projectStatus', args);
/**
 * 导入
 * @param {*} data
 * */
export const dataImport = data => post('/datamapping/importData', data);
/**
 * 获取第三方数据(包含关联或审核状态)
 * @param {*} args
 * */
export const projectDataGet = args => get('/datamapping/projectData', args);
/**
 * 编辑第三方数据(主要编辑关联或审核状态)
 * @param {*} data
 * */
export const projectDataEdit = data => put('/datamapping/projectData', data);
/**
 * 获取站内数据
 * @param {*} args
 * */
export const projectStationGet = args =>
  get('/datamapping/projectStation', args).then(({ err, data }) => {
    if (data && data.data) {
      data.data = _.sortBy(
        _.map(data.data, ({ pcode: pid, code: id, name }) => ({ id, pid: pid || null, name })),
        'id',
      );
    }
    return { err, data };
  });
/**
 * 审核(状态修改)
 * @param {*} args
 * */
export const projectStatusEdit = args => put('/datamapping/projectStatus', args);
/**
 * 日志添加
 * @param {*} data
 * */
export const projectLogAdd = data => post('/datamapping/projectLog', data);
/**
 * 日志获取
 * @param {*} args
 * */
export const projectLogGet = args => get('/datamapping/projectLog', args);
