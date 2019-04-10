<template>
  <div id="relation">
    <!-- 关联 -->
    <div class="look-relation"
      @click="lookRelation">
      {{relationStatus === '3' ? '查看审核' : '查看关联'}}
    </div>
    <div style="margin-top: 16px;">
      <!-- 左侧第三方数据 -->
      <leftdata :relation-status="relationStatus"
        :three-check-data="threeCheckData"
        :all-list="allList"
        :all-num="allNum"
        :norelation-list="norelationList"
        :norelation-num="norelationNum"
        :abnormal-list="abnormalList"
        :abnormal-num="abnormalNum"
        :refuse-list="refuseList"
        :refuse-num="refuseNum"
        :check-list="checkList"
        :check-num="checkNum"
        @threeCheck="threeCheck"
        @activeClick="activeClick" />
      <div class="relation-right">
        <!-- 操作 -->
        <handles :relation-status="relationStatus"
          :three-check-data="threeCheckData"
          :next-disabled="nextDisabled"
          @nextStep="nextStep"
          @abnormal="abnormal"
          @pass="pass" />
        <div class="myname">
          <el-tag v-if="alreadyRelation.name"
            closable
            class="already-check"
            @close="alreadyRelation = {}">
            {{alreadyRelation.name}}
          </el-tag>
        </div>
        <!-- 推荐数据 -->
        <recommenddata :recommend-list="recommendList"
          :already-relation="alreadyRelation"
          @recommendCheck="recommendCheck" />
        <div class="stationData">
          <div class="recommend-title">站内数据：</div>
          <el-input v-model="keyword"
            placeholder="请输入内容"
            style="width:300px;"
            clearable
            autofocus
            @input="searchStation" />
          <el-tree :data="stationOption"
            :expand-on-click-node="expandOnClickNode"
            :highlight-current="true"
            :current-node-key="`${alreadyRelation.id}`"
            node-key="id"
            default-expand-all
            class="stationTree"
            @node-click="stationChange" />
        </div>
        <div class="processingLog">处理日志</div>
        <div class="logStyle">
          <div v-for="(log, k) in logList"
            :key="k"
            class="logs">{{log.createTime}}
            <span style="margin-left:20px;">{{log.userName}}</span>
            <span style="margin:0px 5px;">{{log.actionType === '0' ? '关联' : '审核'}}</span>
            <span>{{log.name}}</span>
          </div>
        </div>
        <abnormal :abnormal-visible="abnormalVisible"
          :form="form"
          :relation-status="relationStatus"
          :label-name="labelName"
          @onSubmit="onSubmit"
          @onCancel="onCancel" />
      </div>
    </div>
  </div>
</template>
<script>
import stringSimilarity from 'string-similarity';
import _ from 'lodash';
import { getTree, dateFormat } from 'util/ui';
import { updateTag } from 'util';
import '../../assets/css/relation.css';
import abnormal from '../common/abnormal';
import leftdata from './relationchild/threedata';
import handles from './relationchild/handles';
import recommenddata from './relationchild/recommendData';
import { projectDataGet, projectStationGet, projectLogGet, projectLogAdd, projectDataEdit } from '../api.js';

export default {
  components: {
    abnormal,
    leftdata,
    handles,
    recommenddata,
  },
  data() {
    return {
      form: {},
      expandOnClickNode: false,
      // 项目ID
      projectId: '',
      // 数据类型
      datatype: '',
      // 1关联(a所有,b未关联,c异常),2修订(a所有,d拒绝),3审核(a所有,e未审核)
      relationStatus: '1',
      // 默认展示全部(第一个)a所有, b未关联, c异常, d拒绝, e未审核
      activeName: 'b',
      // 全部数量
      allNum: 0,
      // 第三方数据:editStatus(0未关联,1已关联,2异常),checkStatus(1通过,2拒绝,3忽略)
      allList: [],
      // 未关联数量
      norelationNum: 0,
      norelationList: [],
      // 异常数量
      abnormalNum: 0,
      abnormalList: [],
      // 拒绝数量
      refuseNum: 0,
      refuseList: [],
      // 未审核数量
      checkNum: 0,
      checkList: [],
      // 第三方已选中数据
      threeCheckData: {},
      // 已关联数据
      alreadyRelation: {},
      // 推荐数据
      recommendList: [],
      // 站内数据
      stationList: [],
      // 级联
      stationOption: [],
      // 日志数据
      logList: [],
      // 2异常或4拒绝弹窗
      abnormalVisible: false,
      labelName: '',
      // 站内数据搜索
      keyword: '',
      // 树形结构末级数据集合(不用了)
      lastTreeList: [],
      // 搜索结果组成的新数据
      newSearch: [],
      // 下一条防止连击
      nextDisabled: false,
    };
  },
  computed: {
    // 搜索时匹配的数据
    lastTreeResult() {
      if (!this.keyword) {
        return this.stationList;
      }
      const words = this.keyword.split(/\s/g).filter(i => i);
      let res = this.stationList;
      for (let index = 0; index < words.length; index++) {
        const word = words[index];
        res = res && res.filter(({ name } = {}) => name && name.indexOf(word) >= 0);
      }
      return res;
    },
  },
  created() {
    // 获取当前操作是：1关联,2修订,3审核
    const { status } = this.$route.params;
    this.relationStatus = status;
    const { projectId = '', datatype = '' } = this.$route.query;
    this.projectId = projectId;
    this.datatype = datatype;
    // 根据当前操作确定默认哪个
    if (this.relationStatus === '1') {
      this.activeName = 'b';
    } else if (this.relationStatus === '2') {
      this.activeName = 'd';
    } else {
      this.activeName = 'e';
    }
    // 获取第三方数据
    this.getThreeList();
  },
  methods: {
    /* 获取第三方数据 */
    getThreeList() {
      const args = {
        projectId: this.projectId,
        datatype: this.datatype,
      };
      projectDataGet(args).then(({ data, err }) => {
        if (!err) {
          const { data: allList = [] } = data;
          // 第三方数据
          this.allList = allList;
          this.allNum = allList.length;
          this.handleThreeData();
        }
      });
    },
    /* 处理第三方数据 */
    handleThreeData() {
      // 关联
      if (this.relationStatus === '1') {
        // 筛选未关联数据
        this.norelationList = _.filter(this.allList, v => v.editStatus === '0') || [];
        this.norelationNum = this.norelationList.length || 0;
        // 筛选异常数据
        this.abnormalList = _.filter(this.allList, v => v.editStatus === '2') || [];
        this.abnormalNum = this.abnormalList.length || 0;
      } else if (this.relationStatus === '2') {
        // 修订(拒绝数量)
        this.refuseList = _.filter(this.allList, v => v.checkStatus === '2') || [];
        this.refuseNum = this.refuseList.length || 0;
        this.threeCheckData = _.head(this.refuseList) || {};
      } else {
        // 审核(未审核数量)
        this.checkList = _.filter(this.allList, v => v.checkStatus === '0') || [];
        this.checkNum = this.checkList.length || 0;
        this.threeCheckData = _.head(this.checkList) || {};
      }
      // 默认选中第一个数据,a所有, b未关联, c异常, d拒绝, e未审核
      switch (this.activeName) {
        case 'a':
          this.threeCheckData = _.head(this.allList) || {};
          break;
        case 'b':
          this.threeCheckData = _.head(this.norelationList) || {};
          break;
        case 'c':
          this.threeCheckData = _.head(this.abnormalList) || {};
          break;
        case 'd':
          this.threeCheckData = _.head(this.refuseList) || {};
          break;
        case 'e':
          this.threeCheckData = _.head(this.checkList) || {};
          break;
        default:
          break;
      }
      // 获取日志
      this.getLogList();
      // 获取站内数据
      this.getStationList();
    },
    /* 获取站内数据 */
    getStationList() {
      projectStationGet({ datatype: this.datatype }).then(({ data, err }) => {
        if (!err) {
          const { data: stationList } = data;
          this.stationList = stationList;
          this.stationOption = getTree(this.stationList);
          // 对树形结构末级数据进行相似度匹配
          this.getLikeList();
        }
      });
    },
    /* 搜索站内数据 */
    searchStation() {
      // 匹配成功后找出对应父级，展示树形结构
      if (this.keyword !== '') {
        this.stationOption = [];
        this.newSearch = this.lastTreeResult;
        this.getFatherList(this.lastTreeResult);
        this.newSearch = _.uniqBy(this.newSearch, 'id');
        this.stationOption = getTree(this.newSearch);
      } else {
        this.stationOption = getTree(this.stationList);
      }
    },
    /* 找出匹配数据的父级(为了组成树形结构) */
    getFatherList(lastTreeResult) {
      _.each(lastTreeResult, v => {
        const temp = _.find(this.stationList, { id: v.pid });
        if (temp) {
          this.newSearch.push(temp);
          this.getFatherList([temp]);
        }
      });
    },
    /* 获取推荐相似数据 */
    getLikeList() {
      const temp = _.reduce(
        this.stationList,
        (result, val) => {
          const likes = this.dataLike(val.name, this.threeCheckData.name || '');
          if (likes > 0.6) {
            result.push({ ...val, likes });
          }
          return result;
        },
        [],
      );
      // 根据相似度倒序排列,并截取前4个.
      this.recommendList = _.slice(_.orderBy(temp, 'likes', 'desc'), 0, 4);
      // 如果已关联则显示关联数据
      if (this.threeCheckData.editStatus !== '0') {
        this.alreadyRelation = {
          id: this.threeCheckData.codeStandard,
          name: this.threeCheckData.nameStandard,
        };
      } else {
        // 把第一个推荐数据直接选中
        this.alreadyRelation = _.head(this.recommendList) || {};
      }
    },
    /* 切换状态 */
    activeClick(threeLeft = {}) {
      // 更新第三方已选中数据
      this.activeName = threeLeft.activeName;
      this.threeCheckData = threeLeft.threeCheckData;
      // 重新获取相似数据
      this.getLikeList();
    },
    /* 选择第三方知识点 */
    threeCheck(val) {
      this.threeCheckData = { ...val };
      // 获取相似数据
      this.getLikeList();
      // 获取日志
      this.getLogList();
    },
    /* 选中推荐数据 */
    recommendCheck(val) {
      this.alreadyRelation = { ...val };
    },
    /* 站内值变化时触发的事件 */
    stationChange(val) {
      // 选择最后一级数据(直接进入关联数据中)
      this.alreadyRelation = { ...val };
    },
    /* 数据相似度比较 */
    dataLike(string1, string2) {
      return stringSimilarity.compareTwoStrings(string1, string2);
    },
    /* 下一条 */
    nextStep() {
      // 根据当前状态获取下一条信息
      this.nextNorelation();
    },
    /* 未关联下一步 */
    nextNorelation() {
      if (_.isEmpty(this.alreadyRelation)) {
        this.$message.error('请选择站内数据');
        return false;
      }
      if (_.isEmpty(this.threeCheckData)) {
        this.$message.error('请选择关联数据');
        return false;
      }
      this.nextDisabled = true;
      const projectData = {
        id: this.threeCheckData.id,
        // 1关联
        editStatus: '1',
        checkStatus: '0',
        // 更新时间
        _status: '1',
        editMsg: '',
        checkMsg: '',
        // 关联的站内数据
        codeStandard: this.alreadyRelation.id || '',
        nameStandard: this.alreadyRelation.name || '',
      };
      this.editProjectData(projectData);
    },
    /* 标记(2异常或4拒绝) */
    abnormal() {
      this.labelName = this.relationStatus === '3' ? '拒绝原因' : '异常原因';
      this.form = {
        content: this.relationStatus === '3' ? '可以找到相关知识点' : '未找到相关知识点',
      };
      this.abnormalVisible = true;
    },
    /* 弹窗确认 */
    onSubmit(content) {
      // relationStatus为1时为编辑人的(异常2)操作,3时为审核人的(拒绝4)操作
      // 根据状态标记选择异常处理还是拒绝处理
      let projectData = {
        id: this.threeCheckData.id,
      };
      if (this.relationStatus === '3') {
        // 拒绝
        projectData = {
          ...projectData,
          checkStatus: '2',
          checkMsg: content,
          editStatus: '0',
        };
      } else {
        // 异常(关联或修订)传递_status,更新时间
        projectData = {
          ...projectData,
          editStatus: '2',
          editMsg: content,
          checkStatus: '0',
          _status: '1',
        };
      }
      this.editProjectData(projectData);
    },
    /* 弹窗关闭 */
    onCancel() {
      this.abnormalVisible = false;
    },
    /* 审核(1通过或3忽略) */
    pass(status) {
      if (status === '1') {
        if (_.isEmpty(this.alreadyRelation)) {
          this.$message.error('请选择站内数据');
          return false;
        }
      }
      if (_.isEmpty(this.threeCheckData)) {
        this.$message.error('请选择关联数据');
        return false;
      }
      this.nextDisabled = true;
      const projectData = {
        id: this.threeCheckData.id,
        checkStatus: status,
        checkMsg: '',
        editMsg: '',
      };
      this.editProjectData(projectData);
    },
    /* 编辑数据状态 */
    editProjectData(projectData) {
      projectDataEdit(projectData).then(({ err }) => {
        if (!err) {
          this.logAdd();
          // 弹窗关闭
          this.abnormalVisible = false;
          // 防止下一条连击
          this.nextDisabled = false;
          // 根据activeName判断下一个是哪个(并修改状态)
          const key = _.findKey(this.allList, v => v.id === this.threeCheckData.id);
          this.$set(this.allList, key, { ...this.threeCheckData, ...projectData });
          switch (this.activeName) {
            case 'a':
              // 所有时重新请求数据
              this.handleThreeData();
              break;
            case 'b':
              // 关联成功下一条
              this.tonextB('norelationList', 'norelationNum');
              break;
            case 'c':
              // 处理异常(关联并下一条)
              this.tonextB('abnormalList', 'abnormalNum');
              break;
            case 'd':
              // 处理拒绝(关联并下一条)
              this.tonextB('refuseList', 'refuseNum');
              break;
            case 'e':
              // 审核(1通过,2拒绝,3忽略)
              this.tonextB('checkList', 'checkNum');
              break;
            default:
              break;
          }
          this.$message({
            type: 'success',
            message: '标记成功',
          });
        } else {
          this.$message.error('标记失败');
        }
      });
    },
    // 关联成功，跳转下一条
    tonextB(list, num) {
      // 把状态改为已关联,并从未关联中去掉
      this[list] = _.filter(this[list], v => v.id !== this.threeCheckData.id) || [];
      this.alreadyRelation = {};
      if (this[list].length > 0) {
        this.threeCheck(_.head(this[list]));
      } else {
        this.threeCheckData = {};
      }
      this[num] = this[list].length || 0;
    },
    /* 添加日志 */
    logAdd() {
      const logData = {
        projectId: this.projectId,
        datatype: this.datatype,
        name: this.threeCheckData.name,
        code: this.threeCheckData.id,
        // relationStatus是3为审核,1,2为编辑
        actionType: this.relationStatus === '3' ? '1' : '0',
        // 日志内容
        msg: '',
      };
      projectLogAdd(logData).then(({ err }) => {
        if (!err) {
          this.getLogList();
        }
      });
    },
    /* 获取日志 */
    getLogList() {
      // 获取每条信息的操作日志
      const args = {
        projectId: this.projectId,
        datatype: this.datatype,
        code: this.threeCheckData.id,
      };
      projectLogGet(args).then(({ data, err }) => {
        if (!err) {
          const { data: logList } = data;
          // 格式化日志中的时间dateFormat
          this.logList = [];
          _.each(logList, v => {
            this.logList.push({
              ...v,
              createTime: dateFormat(v.createTime),
            });
          });
        }
      });
    },
    /* 查看关联 */
    lookRelation() {
      let toUrl = `/datamap/seeRelation?projectId=${this.projectId}&datatype=${this.datatype}`;
      if (this.relationStatus === '3') {
        toUrl = `/datamap/seeExamine?projectId=${this.projectId}&datatype=${this.datatype}`;
      }
      updateTag({
        name: this.relationStatus === '3' ? '查看审核' : '查看关联',
        cmd: 'closeUpdateTag',
        from: `/datamap/relation/${this.relationStatus}?projectId=${this.projectId}&datatype=${this.datatype}`,
        to: toUrl,
        appPath: window.location.pathname,
      });
    },
    filterMethod(keyword) {
      this.keyword = keyword;
    },
  },
};
</script>
