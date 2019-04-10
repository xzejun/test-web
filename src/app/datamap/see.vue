<template>
  <div>
    <div class="title">
      <span class="project-name">数理化</span>
      <span class="project-remark">这是备注</span>
    </div>
    <el-input v-model="keyword"
      placeholder="输入关联类型检索,多关键字用空格隔开"
      style="width:300px;margin-bottom:16px;"
      clearable
      autofocus
      @input="filterList" />
    <el-table :data="tableData"
      style="width: 100%">
      <el-table-column prop="name"
        label="关联类型" />
      <el-table-column :formatter="formatEditor"
        prop="editor"
        label="编辑人"
        width="180" />
      <el-table-column :formatter="formatChecker"
        prop="checker"
        label="审核人"
        width="180" />
      <el-table-column prop="status"
        label="状态"
        width="180"
        class="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '0'">
            <div class="state background_hui" />草稿</span>
          <span v-if="scope.row.status === '1'">
            <div class="state background_blue" />审核中</span>
          <span v-if="scope.row.status === '2'">
            <div class="state background_origin" />修订中</span>
          <span v-if="scope.row.status === '3'">
            <div class="state background_green" />已发布</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
        fixed="right">
        <template slot-scope="scope">
          <div v-if="scope.row.status==='0'">
            <span type="text"
              class="edit"
              @click="importData(scope.row.datatype)">导入数据</span>
            <span class="line">|</span>
            <span type="text"
              class="edit"
              @click="relation(scope.row.datatype)">关联</span>
            <span class="line">|</span>
            <span type="text"
              class="edit"
              @click="seeRelation(scope.row.datatype,'one')">查看关联</span>
          </div>
          <div v-if="scope.row.status==='1'">
            <span type="text"
              class="edit"
              @click="checks(scope.row.datatype)">审核</span>
            <span class="line">|</span>
            <span type="text"
              class="edit"
              @click="seeExamine(scope.row.datatype)">查看审核</span>
          </div>
          <div v-if="scope.row.status==='3'">
            <span type="text"
              class="edit"
              @click="seeResult(scope.row.datatype)">查看结果</span>
          </div>
          <div v-if="scope.row.status==='2'">
            <span type="text"
              class="edit"
              @click="seeRelation(scope.row.datatype,'two')">查看关联</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import _ from 'lodash';
import { updateTag } from 'util';
import { projectStatusGet, appUserGet } from '../api';

export default {
  data() {
    // 获取参数 项目Id
    const { projectId = '' } = this.$route.params;
    return {
      keyword: '',
      projectId,
      tableData: [],
      tableDataClone: [],
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    getlist() {
      projectStatusGet({ projectId: this.projectId }).then(({ data, err }) => {
        if (!err) {
          const { data: tableData = [] } = data || {};
          this.tableData = tableData;
          this.tableDataClone = _.cloneDeep(this.tableData);
          this.getUser();
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
    /** 导入数据 */
    importData(datatype) {
      updateTag({
        name: '导入数据',
        cmd: 'addTag',
        to: `/datamap/importData/${this.projectId}/${datatype}`,
        appPath: window.location.pathname,
      });
    },
    /* 关联跳转 */
    relation(datatype) {
      updateTag({
        name: '关联数据',
        cmd: 'addTag',
        to: `/datamap/relation/1?projectId=${this.projectId}&datatype=${datatype}`,
        appPath: window.location.pathname,
      });
    },
    /* 审核跳转 */
    checks(datatype) {
      updateTag({
        name: '审核数据',
        cmd: 'addTag',
        to: `/datamap/relation/3?projectId=${this.projectId}&datatype=${datatype}`,
        appPath: window.location.pathname,
      });
    },
    // 关联跳转
    seeRelation(datatype, state) {
      updateTag({
        name: '查看关联',
        cmd: 'addTag',
        to: `/datamap/seeRelation?projectId=${this.projectId}&datatype=${datatype}&state=${state}`,
        appPath: window.location.pathname,
      });
    },
    // 审核跳转
    seeExamine(datatype) {
      updateTag({
        name: '查看审核',
        cmd: 'addTag',
        to: `/datamap/seeExamine?projectId=${this.projectId}&datatype=${datatype}`,
        appPath: window.location.pathname,
      });
    },
    // 结果跳转
    seeResult(datatype) {
      updateTag({
        name: '查看结果',
        cmd: 'addTag',
        to: `/datamap/seeResult?projectId=${this.projectId}&datatype=${datatype}`,
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
.title {
  margin-bottom: 32px;
  .project-name {
    height: 37px;
    font-size: 26px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 37px;
    margin-right: 16px;
  }
  .project-remark {
    height: 22px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 22px;
  }
}
.status {
  font-size: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
}
.state {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
}
.background_origin {
  background: rgba(245, 166, 35, 1);
}
.background_blue {
  background: rgba(89, 126, 247, 1);
}
.background_green {
  background: rgba(19, 206, 102, 1);
}
.background_red {
  background: rgba(255, 73, 73, 1);
}
.background_hui {
  background: rgba(191, 191, 191, 1);
}
</style>
