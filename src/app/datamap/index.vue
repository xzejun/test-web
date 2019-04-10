<template>
  <div>
    <el-button type="primary"
      icon="el-icon-plus"
      style="margin-bottom:24px"
      @click="add">新建项目</el-button>
    <div class="main">
      <div v-for="(item,index) in tableData"
        :key="index"
        class="main-box">
        <el-row>
          <div class="startline" />
          <el-col :span="18">

            <div class="up">
              <span class="project-name">{{item.name}}</span>
              <span class="project-remark">{{item.comment}}</span>
            </div>
            <div class="down">
              <div v-for="(v,i) in item.datatypes"
                :key="i"
                class="project-types">
                <span>{{formatter(v)}}</span>
              </div>
            </div>

          </el-col>
          <el-col :span="6">
            <div class="right">
              <a class="edit"
                @click="see(item.id)">查看</a>
              <a v-if="item.status !== '1'"
                class="line">|</a>
              <a v-if="item.status !== '1'"
                class="edit"
                @click="edit(item)">编辑</a>
              <a class="line">|</a>
              <a class="del"
                @click="del(item)">删除</a>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <project :visible="visible"
      :title="title"
      :editor-data="editorData"
      :data-type-data="dataTypeData"
      @onSubmit="onSubmit"
      @onCancel="onCancel" />
  </div>
</template>

<script>
import _ from 'lodash';
import { updateTag } from 'util';
import project from './project-edit.vue';
import { projectGet, projectAdd, projectEdit, projectDel, projectDataTypeGet } from '../api';

export default {
  components: {
    project,
  },
  data() {
    return {
      tableData: [],
      title: '',
      visible: false,
      editorData: {},
      dataTypeData: [],
    };
  },
  created() {
    // 获取关联数据类型
    // 获取数据类型
    projectDataTypeGet().then(({ data, err }) => {
      if (!err) {
        const { data: dataType = [] } = data || {};
        this.dataTypeData = dataType;
      }
    });
    this.getlist();
  },
  methods: {
    /** 获取项目列表 */
    getlist() {
      // 获取项目列表
      projectGet().then(({ data, err }) => {
        if (!err) {
          const { data: tableData = [] } = data || {};
          _.each(tableData, v => {
            v.datatypes = JSON.parse(v.datatypes);
          });
          this.tableData = tableData;
        }
      });
    },

    /** 格式化数据 */
    formatter(v) {
      return (_.find(this.dataTypeData, { code: v }) || {}).name;
    },
    /** 新增项目 */
    add() {
      this.visible = true;
      this.title = '新建项目';
    },
    /** 编辑项目 */
    edit(row) {
      this.editorData = { ...row };
      this.visible = true;
      this.title = '编辑项目';
    },
    /** 确定 */
    onSubmit(form) {
      const { id = '', datatypes = [], comment, name } = form || {};
      if (id) {
        // 编辑操作
        const params = {
          datatypes: JSON.stringify(datatypes),
          name,
          comment,
          id,
        };
        projectEdit(params).then(({ err }) => {
          if (!err) {
            this.getlist();
            this.$message.success('编辑成功');
          } else {
            this.$message.error('编辑失败');
          }
        });
      } else {
        // 添加操作
        const params = {
          datatypes: JSON.stringify(datatypes),
          name,
          comment,
        };
        projectAdd(params).then(({ err }) => {
          if (!err) {
            this.getlist();
            this.$message.success('添加成功');
          } else {
            this.$message.error('添加失败');
          }
        });
      }
    },
    /** 取消 */
    onCancel() {
      this.visible = false;
    },
    /** 删除 */
    del(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          projectDel({ id: row.id }).then(({ err }) => {
            if (!err) {
              this.getlist();
              this.$message.success('删除成功');
            } else {
              this.$message.error('删除失败');
            }
          });
        })
        .catch(() => {
          // do nothing
        });
    },
    /** 查看 */
    see(id = '22') {
      updateTag({
        name: '查看项目',
        cmd: 'addTag',
        to: `/datamap/see/${id}`,
        appPath: window.location.pathname,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  border-bottom: 1px solid rgba(233, 233, 233, 1);
  .main-box {
    width: 100%;
    .up {
      margin: 16px 24px 8px 67px;
      .project-name {
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
      .project-remark {
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        margin-left: 24px;
      }
    }
    .down {
      margin: 0 24px 17px 67px;
      .project-types {
        height: 22px;
        background: rgba(250, 250, 250, 1);
        border: 1px solid rgba(217, 217, 217, 1);
        display: inline-block;
        margin-left: 4px;
        span {
          margin: 0 8px 0 8px;
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
          line-height: 22px;
        }
      }
    }
    .right {
      margin-right: 24px;
      display: block;
      float: right;
      a {
        line-height: 80px;
      }
    }
  }
  .startline {
    width: 100%;
    height: 1px;
    background: rgba(233, 233, 233, 1);
  }
}
</style>
