/**
 * 如果exts()为true则为浏览器
 */
const { exts = {} } = window.top;
// 打印机状态
const runAsync = (value = { errno: '请在客户端打开' }) => {
  const p = new Promise((resolve, reject) => {
    reject(value);
  });
  return p;
};
/**
 * @param{无}any
 * 获取扫描源
 * @data {[]}当前电脑扫描仪台数及信息
 *
 */
export const scanSources = () => (exts ? exts.scanSources() : runAsync());

/**
 *开始扫描
 * @param {班级信息,扫描仪信息} any
 * @data { busying ,scanning } 繁忙,开始扫描
 */
export const scanStart = (...data) => (exts ? exts.scanStart(...data) : runAsync());

/**
 * 获取文件列表
 * @param {参1:{} 当前班级信息}
 * @data {scanned:[],uploaded:[]} {已扫描,已上传}
 */
export const scanFiles = (...data) => exts.scanFiles(...data);

/**
 * 获取单个文件图像
 * @param {参1:{} ,{file:'',flag:'1', width:100, type:1, }}当前班级信息,文件信息
 * @data {string图/缩略图base64字符串}
 */
export const scanFile = (...data) => exts.scanFile(...data);

/**
 * 删除单个文件
 * @param {参1:{} ,{file:'', type:1, }}
 * @data {无}
 */
export const scanDel = (...data) => exts.scanDel(...data);

/**
 * 批量删除文件
 * @param { 参1:{} 当前班级信息,参2:string  0, 已扫描 1,已上传 2,全部}
 * @data {无}
 */
export const scanDelAll = (...data) => exts.scanDelAll(...data);

/**
 * 上传文件
 * @param { 参1:{} 当前班级信息,参2{file, //文件id url,  //上传服务地址 token, //token headers// 上传头 ... 其它request信息}}
 * @data {无}
 */
export const scanUpload = (...data) => exts.scanUpload(...data);

/**
 * 强制关闭
 * @param {无}
 * @data {无}
 */
export const scanClose = () => exts.scanClose();

/**
 * 监听当前打印机状态
 */
export const scanStatus = data => {
  let status = '';
  switch (data) {
    case 'prepare':
      status = '准备';
      break;
    case 'scanning':
      status = '运行中';
      break;
    case 'free':
      status = '已结束';
      break;
    case 'updated':
      status = '完成更新';
      break;
    case 'error':
      status = '更新异常';
      break;

    default:
      status = data;
  }
  return status;
};
