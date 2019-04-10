import _ from 'lodash';
import dayjs from 'dayjs';

/**
 *获取树形数据
 * @param data
 * @param sid 当前已选择数据id
 * @param pid //父级数据id
 * @param depth //tree默认levelKey
 * @returns {Array}
 */
export function getTree(data = [], merge = false, sid, pid = null) {
  const children = [];
  let depth; // el-tree-table  需要用此字段表示层级
  _.forEach(data, value => {
    const node = value;
    if (((!pid && !node.pid) || node.pid === pid) && node.id !== sid) {
      if (node.pid) {
        // 有父级，子级的depth ++
        let { depth: dt } = _.find(data, { id: node.pid });
        depth = dt ? ++dt : 1;
      } else {
        depth = 1;
      }
      node.depth = depth; // 原数据加上depth树形
      // 判断node中是否有children
      const { children: isChildren = '', ...nodes } = node;
      const childrens = getTree(data, merge, sid, node.id);
      if (isChildren) {
        children.push({
          key: node.id,
          value: merge ? `${node.id},${node.name}` : `${node.id}`,
          label: node.name,
          depth,
          ...nodes,
          children: childrens !== undefined ? childrens : [{}],
        });
      } else {
        children.push({
          key: node.id,
          value: merge ? `${node.id},${node.name}` : `${node.id}`,
          label: node.name,
          depth,
          ...nodes,
          children: childrens,
        });
      }
    }
  });
  return children.length ? children : undefined;
}
/**
 *
 * @param {Array} data
 * @param {String} sid
 * @param {String} pid
 */
export function makeMenu(data = [], sid, pid = null) {
  const subs = [];
  _.forEach(data, value => {
    const node = value;
    if (((!pid && !node.pid) || node.pid === pid) && node.id !== sid) {
      subs.push({
        key: node.id,
        index: node.path || node.id, // path不存在。如果index相同会导致菜单无法只展开一个
        title: node.name,
        icon: node.icon,
        subs: makeMenu(data, sid, node.id),
      });
    }
  });
  return subs.length ? subs : undefined;
}
/**
 * 获取所有父id
 * @param data
 * @param id
 * @returns {Array}
 */
export function getTreeParentIds(data = [], id) {
  let node;
  let cid = id;
  const pids = [];
  const fn = i => i.id === cid;
  do {
    node = _.find(data, fn);
    if (node && node.pid) {
      cid = node.pid;
      pids.push(cid);
    }
  } while (node && node.pid);
  return pids;
}

/**
 * 获取所有子节点
 * @param data
 * @param pid
 * @returns {*}
 */
export function getTreeAllChildrenIds(data = [], pid = null) {
  const children = [];
  _.forEach(data, value => {
    const node = value;
    if ((!pid && !node.pid) || node.pid === pid) {
      children.push(node.id);
      const subs = getTreeAllChildrenIds(data, node.id);
      if (subs) {
        children.push(...subs);
      }
    }
  });
  return children.length ? children : undefined;
}

/**
 * 日期转换
 * @param {*} date 需要转化的日期
 * @param {*} format 需要转化为的格式
 */
export const dateFormat = (date, format = 'YYYY-MM-DD HH:mm') => (date ? dayjs(date).format(format) : '');
/**
 * 计算学生所在当前年级
 * @param {*} schoolinglength 学校学制
 * @param {*} graduates 学生学届
 * @param {*} gradeList 学校年级列表
 * @param {*} section 学段
 */
export default function studentGradeGet(schoolinglength, graduates, gradeList = [], section) {
  // 根据是否超过当年的八月一号,判断年份
  let year = '';
  if (dayjs().isBefore(dayjs(`${dayjs().year()}-08-01`))) {
    year = `${dayjs().year() - 1}`;
  } else {
    year = `${dayjs().year()}`;
  }
  // 字典里年级对应的code
  let grade = '';
  grade = `${schoolinglength - (graduates - year) + 1}`;
  if (section === '3') {
    // 高中
    switch (grade) {
      case '1':
        grade = 'a';
        break;
      case '2':
        grade = 'b';
        break;
      case '3':
        grade = 'c';
        break;
      default:
        grade = '';
    }
  } else if (section === '2') {
    // 初中
    switch (grade) {
      case '1':
        grade = '7';
        break;
      case '2':
        grade = '8';
        break;
      case '3':
        grade = '9';
        break;
      default:
        grade = '';
    }
  } else {
    // 小学 不做处理,根据学制算出的班级code和字典code一致
  }
  return (_.find(gradeList, { code: grade }) || {}).name;
}
/**
 * 计算该校入学年份和学届
 * @param {*} state 登录时保存的user信息
 */
export function schoolDataGet(state) {
  // 获取学校的学制和学段
  const { user: { school: { schoolinglength = '5', section = '' } = {} } = {} } = state;
  // 根据是否超过当年的八月一号,判断年份
  let year = '';
  if (dayjs().isBefore(dayjs(`${dayjs().year()}-08-01`))) {
    year = dayjs().year() - 1;
  } else {
    year = dayjs().year();
  }
  // 该校入学年份的筛选数据
  const entranceDateFilters = [];
  // 该校学届的筛选数据
  const graduatesFilters = [];
  for (let i = 0; i <= schoolinglength; i++) {
    entranceDateFilters.push({ text: `${year - i}`, value: `${year - i}` });
    graduatesFilters.push({ text: `${year + i}`, value: `${year + i}` });
  }
  entranceDateFilters.unshift({ text: `${year + 1}`, value: `${year + 1}` });
  graduatesFilters.push({
    text: `${year + parseInt(schoolinglength, 0) + 1}`,
    value: `${year + parseInt(schoolinglength, 0) + 1}`,
  });
  // 入学年份的筛选数据 学届的筛选数据 学段
  const schoolData = { entranceDateFilters, graduatesFilters, section, schoolinglength };
  return schoolData;
}
const PromiseReduce = (iterable, reducer, initVal) => new Promise((resolve, reject) => {
  const iterator = iterable[Symbol.iterator]();
  let i = 0;
  const next = total => {
    const el = iterator.next();
    if (el.done) {
      resolve(total);
      return;
    }
    Promise.all([total, el.value])
      .then(value => {
        next(reducer(value[0], value[1], i++));
      })
      .catch(reject);
  };
  next(initVal);
});

export const PromiseEach = (iterable, iterator) => PromiseReduce(iterable, (a, b, i) => iterator(b, i)).then(() => iterable);
