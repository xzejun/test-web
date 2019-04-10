<template>
  <div>
    <span class="knowledge">{{knowledgeName}}</span>
    <div class="div-select">
      <span class="relation-status">关联状态：</span>
      <el-select v-model="relation"
        class="select"
        placeholder="请选择"
        @change="relationChange">
        <el-option v-for="item in relationOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      <span class="examine-status">审核状态：</span>
      <el-select v-model="examine"
        class="select"
        placeholder="请选择"
        @change="examineChange">
        <el-option v-for="item in examineOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      <span class="input">
        <el-input v-model="keyword"
          placeholder="输入关联类型检索,多关键字用空格隔开"
          style="width:300px;margin-bottom:16px;"
          clearable
          autofocus
          @input="filterList" />
        <!-- <el-button class="input-button"
          type="primary">搜索</el-button> -->
      </span>
    </div>
    <div class="table">
      <template>
        <el-table :data="tableData"
          style="width: 100%">
          <el-table-column prop="code"
            label="编码" />
          <el-table-column prop="name"
            label="内容" />
          <el-table-column prop="nameStandard"
            label="关联站内" />
          <el-table-column :formatter="formatEditor"
            prop="editor"
            label="编辑人" />
          <el-table-column :formatter="formatChecker"
            prop="checker"
            label="审核人" />
          <el-table-column prop="editStatus"
            label="关联状态">
            <template slot-scope="scope">
              <span v-if="scope.row.editStatus==='0'">
                <div class="editStatusStyleZero" /> 未关联
              </span>
              <span v-if="scope.row.editStatus==='1'">
                <div class="editStatusStyleOne" /> 已关联
              </span>
              <span v-if="scope.row.editStatus==='2'">
                <div class="editStatusStyleTwo" /> 异常
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="editMsg"
            label="异常原因" />
          <el-table-column prop="checkStatus"
            label="审核状态">
            <template slot-scope="scope">
              <span v-if="scope.row.checkStatus==='2'">
                <div class="editStatusStyleZero" /> 拒绝
              </span>
              <span v-if="scope.row.checkStatus==='1'">
                <div class="editStatusStyleOne" /> 通过
              </span>
              <span v-if="scope.row.checkStatus==='3'">
                <div class="editStatusStyleTwo" /> 忽略
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="checkMsg"
            label="拒绝原因" />
          <el-table-column prop="address"
            label="操作">
            <template v-if="scope.row.checkStatus!=='3'"
              slot-scope="scope">
              <a class="address"
                @click="examineEdit(scope.row.projectId)">审核</a>
              <span class="operation-span">|</span>
              <a class="address"
                @click="ignore(scope.row.id)">忽略</a>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-button type="primary"
        class="button"
        @click="submission">{{status ? '发布' : '修订'}}</el-button>
    </div>
    <router-view />
  </div>
</template>

<script>
import _ from 'lodash';
import { updateTag } from 'util';
import {
  projectDataGet,
  projectDataTypeGet,
  projectStatusGet,
  projectStatusEdit,
  projectDataEdit,
  appUserGet,
} from '../api.js';

export default {
  data() {
    const { projectId, datatype } = this.$route.query;
    return {
      // 关联选择
      relationOptions: [
        { value: '', label: '全部' },
        { value: '0', label: '未关联' },
        { value: '1', label: '已关联' },
        { value: '2', label: '异常' },
      ],
      // 状态选择 // 通过1 拒绝2 忽略3
      examineOptions: [
        { value: '', label: '全部' },
        { value: '1', label: '通过' },
        { value: '2', label: '拒绝' },
        { value: '3', label: '忽略' },
      ],
      // 搜索数据
      keyword: '',
      // 项目id
      projectId,
      // 数据id
      datatype,
      // 关联已选择数据
      relation: '',
      // 状态已选择数据
      examine: '',
      // 列表数据
      tableData: [],
      tableDataClone: [],
      // 知识点
      knowledgeName: '',
      // 是否可以提交状态
      status: true,
    };
  },
  // 进入页面先执行
  created() {
    // 获取列表
    this.examineInfo();
  },
  methods: {
    // 查看关联的关联信息列表
    examineInfo() {
      // 一起执行两个方法
      let para = {
        projectId: this.projectId,
        _status: '2',
        datatype: this.datatype,
      };
      if (this.relation !== '') {
        para = {
          ...para,
          editStatus: this.relation || '',
        };
      }
      if (this.examine !== '') {
        para = {
          ...para,
          checkStatus: this.examine || '',
        };
      }
      Promise.all([
        // 列表获取
        projectDataGet(para),
        // 知识点名称获取
        projectDataTypeGet({ code: this.datatype }),
      ]).then(res => {
        const [
          {
            err,
            data: { data = [], status = false },
          },
          { err: errs, data: datas },
        ] = res;
        if (!err) {
          this.tableData = data;
          this.status = status;
          this.tableDataClone = _.cloneDeep(this.tableData);
          this.getUser();
        }
        if (!errs) {
          const { data = [] } = datas;
          this.knowledgeName = data[0] ? data[0].name : '';
        }
      });
    },
    /** 过滤数据,搜索框 */
    filterList() {
      if (!this.keyword) {
        this.tableData = this.tableDataClone;
        return this.tableData;
      }
      const words = this.keyword.split(/\s/g).filter(i => i);
      let res = this.tableDataClone;
      for (let index = 0; index < words.length; index++) {
        const word = words[index];
        res = res && res.filter(({ name } = {}) => name && name.indexOf(word) >= 0);
      }
      this.tableData = res;
      return this.tableData;
    },
    // 更改审核信息
    submission() {
      projectStatusGet({ projectId: this.projectId }).then(({ err, data: Data }) => {
        if (!err) {
          const { data: datas } = Data || {};
          const ids = (_.find(datas, { projectId: this.projectId, datatype: this.datatype }) || {}).id;
          if (!_.isEmpty(ids)) {
            projectStatusEdit({ id: ids, status: this.status ? '3' : '2' }).then(({ err: errs }) => {
              if (!errs) {
                this.$message({
                  message: this.status ? '发布成功' : '修订状态改变成功',
                  type: 'success',
                });
                if (this.status) {
                  updateTag({
                    name: '查看结果',
                    cmd: 'addTag',
                    to: `/datamap/seeResult?projectId=${this.projectId}&datatype=${this.datatype}`,
                    appPath: window.location.pathname,
                  });
                } else {
                  updateTag({
                    name: '查看结果',
                    cmd: 'addTag',
                    to: `/datamap/see/${this.projectId}`,
                    appPath: window.location.pathname,
                  });
                }
              }
            });
          }
        }
        // console.log(id);
      });
    },
    // 忽略
    ignore(id) {
      projectDataEdit({ id, checkStatus: '3' }).then(({ err }) => {
        if (!err) {
          this.$message({
            message: '忽略成功',
            type: 'success',
          });
          // 获取列表
          this.examineInfo();
        }
      });
    },
    // 关联状态筛选
    relationChange(relation) {
      this.relation = relation;
      this.examineInfo();
    },
    // 审核状态筛选
    examineChange(examine) {
      this.examine = examine;
      this.examineInfo();
    },
    // 审核编辑
    examineEdit(projectId) {
      updateTag({
        name: '关联数据',
        cmd: 'addTag',
        to: `/datamap/relation/3?projectId=${projectId}&datatype=${this.datatype}`,
        appPath: window.location.pathname,
      });
    },
    /* 获取用户信息 */
    getUser() {
      let userIds = [];
      _.each(this.tableData, v => {
        if (v.editor) {
          userIds.push(v.editor);
        }
        if (v.checker) {
          userIds.push(v.checker);
        }
      });
      userIds = _.uniq(userIds);
      // 为空时不在请求
      if (_.isEmpty(userIds)) {
        return false;
      }
      appUserGet({ userIds }).then(({ data, err }) => {
        if (!err) {
          const { data: userList } = data;
          this.userList = userList;
          this.tableData = [...this.tableData];
        }
      });
    },
    /* 筛选编辑人 */
    formatEditor(row) {
      return (_.find(this.userList, { id: row.editor }) || {}).username || '';
    },
    /* 筛选审核人 */
    formatChecker(row) {
      return (_.find(this.userList, { id: row.checker }) || {}).username || '';
    },
  },
};
</script>
<style lang="less" scoped>
.knowledge {
  width: 182px;
  height: 37px;
  font-size: 26px;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
  line-height: 37px;
}

.div-select {
  padding: 0 6px 0 6px;
  .input {
    // position: absolute;
    float: right;
    .input-frame {
      width: 276px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
    }
    .input-button {
      margin-left: 8px;
    }
  }
  margin-top: 32px;
  .relation-status {
    font-size: 14px;
  }
  .examine-status {
    margin-left: 48px;
    font-size: 14px;
  }
  .select {
    width: 222px;
    height: 32px;
    margin-left: 6px;
  }
}
.table {
  margin-top: 24px;
  text-align: center;
  .operation-span {
    margin: 0 5px 0 5px;
    color: #66b1ff;
  }
  .button {
    width: 65px;
    height: 32px;
    background: rgba(24, 144, 255, 1);
    margin-top: 24px;
  }
  .editStatusStyleZero {
    display: inline-block;
    border-radius: 6px;
    width: 6px;
    height: 6px;
    background: rgba(245, 166, 35, 1);
  }
  .editStatusStyleOne {
    display: inline-block;
    border-radius: 6px;
    width: 6px;
    height: 6px;
    background: rgba(19, 206, 102, 1);
  }
  .editStatusStyleTwo {
    display: inline-block;
    border-radius: 6px;
    width: 6px;
    height: 6px;
    background: rgba(255, 73, 73, 1);
  }
  .address {
    cursor: pointer;
  }
}
</style>
