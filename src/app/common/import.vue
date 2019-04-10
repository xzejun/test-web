<template>
  <div class="importTemplate">
    <div class="instruction">
      <h1> <img :src="src">导入说明：</h1>
      <p>1、请先<a :href="fileUrl"
          :download="propsData.fileName"
          class="underline"
          target="_blank">下载数据模板</a>，按照模板填写说明要求编辑数据信息，保存为Excel文件；</p>
      <p>2、点击 “选择数据文件”，上传编辑好的Excel文件；</p>
      <p>3、点击 ” 导入数据 “，导入{{propsData.name}}数据；导入过程中，会检查所上传数据是否正确，数据报错，请检查编辑后重新导入</p>
    </div>
    <el-card style="width:100%;">
      <div slot="header">
        <span>导入{{propsData.name}}</span>
      </div>
      <div class="importTable">
        <div class="firstRow">
          <div class="firstCol">
            <p>1、下载数据模板</p>
          </div>
          <div class="secendCol">
            <div>
              <el-button type="primary">
                <a :href="fileUrl"
                  :download="propsData.fileName"
                  target="_blank">下载数据模板</a>
              </el-button>
            </div>
          </div>
          <div class="thirdCol">
            <h1>数据模板填写说明：</h1>
            <p v-for="(item, i) in propsData.description"
              :key="i">{{i + 1}}.{{item}}</p>
          </div>
        </div>
        <div class="secendRow">
          <div class="firstCol">
            2、选择数据文件
          </div>
          <div class="secendCol">
            <el-upload :limit="1"
              :headers="headers"
              :action="propsData.url"
              :on-change="handleChange"
              :on-remove="onRemove"
              :on-error="onError"
              class="upload">
              <el-button type="primary">选择数据文件</el-button>
            </el-upload>
            <p v-show="disabled">未选择文件</p>
          </div>
        </div>
        <div class="thirdRow">
          <div class="firstCol">
            3、检查并导入数据
          </div>
          <div class="secendCol">
            <el-button :disabled="disabled"
              type="primary"
              @click="importData">导入数据</el-button>
            <el-table v-if="propsData.errData.length"
              :data="propsData.errData"
              stripe
              border
              style="width: 100%;line-height:30px;">
              <el-table-column prop="rowNum"
                label="行号" />
              <el-table-column prop="errMsg"
                label="错误原因" />
            </el-table>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash';
import { getToken, cdnUrl } from 'util';

export default {
  props: {
    propsData: Object,
  },
  data() {
    return {
      fileData: [],
      // eslint-disable-next-line
      src: require('../../assets/information.png'),
    };
  },
  computed: {
    disabled() {
      return _.isEmpty(this.fileData);
    },
    headers() {
      return this.propsData.headers || { authorization: getToken(true, 'string') };
    },
    fileUrl() {
      return `${cdnUrl}${this.propsData.file}`;
    },
  },
  methods: {
    handleChange(file) {
      const { response: { data, err } = {} } = file;
      if (err) {
        return this.$message.error(err);
      }
      this.fileData = data;
    },
    onError() {
      this.$message.error('服务器错误，请稍后再试');
    },
    onRemove() {
      this.fileData = [];
    },
    importData() {
      this.$emit('importData', this.fileData);
    },
  },
};
</script>
<style lang="less">
.importTemplate {
  .el-card {
    box-shadow: none;
    .el-card__header {
      background: #fafafa;
      font-weight: 500;
    }
  }
}
</style>


<style lang="less" scoped>
.instruction {
  background-color: #e6f7ff;
  padding: 14px 20px;
  border: 1px solid #91d5ff;
  height: 128px;
  margin-bottom: 24px;
  h1 {
    line-height: 42px;
    font-size: 16px;
    img {
      height: 24px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  p {
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    margin-left: 34px;
  }
}
.importTable {
  display: flex;
  flex-direction: column;
  border: 1px solid #f2f2f2;
  width: 100%;
  margin-top: 40px;
  .firstRow,
  .secendRow,
  .thirdRow {
    display: flex;
    flex-direction: row;
  }
  .firstRow {
    border-bottom: 1px solid #f2f2f2;
    .firstCol:before,
    .secendCol:before {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
    .firstCol {
      width: 20%;
      flex: none;
      text-align: center;
      border-right: 1px solid #f2f2f2;
      p {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .secendCol {
      width: 30%;
      padding: 30px;
      border-right: 1px solid #f2f2f2;
      div {
        display: inline-block;
        vertical-align: middle;
      }
      a {
        color: #fff;
      }
    }
    .thirdCol {
      width: 50%;
      padding: 30px;
      h1 {
        font-size: 14px;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.65);
      }
      p {
        line-height: 22px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
  .secendRow {
    border-bottom: 1px solid #f2f2f2;
    .firstCol {
      width: 20%;
      flex: none;
      text-align: center;
      border-right: 1px solid #f2f2f2;
      line-height: 100px;
    }
    .secendCol {
      width: 80%;
      border-right: 1px solid #f2f2f2;
      padding-left: 30px;
      padding-top: 30px;
      .upload {
        display: flex;
        flex-direction: row;
        button {
          margin-top: 10px;
        }
      }
    }
  }
  .thirdRow {
    border-bottom: 1px solid #f2f2f2;
    .firstCol {
      width: 20%;
      flex: none;
      text-align: center;
      border-right: 1px solid #f2f2f2;
      line-height: 100px;
    }
    .secendCol {
      width: 80%;
      border-right: 1px solid #f2f2f2;
      line-height: 100px;
      padding-left: 30px;
    }
  }
}
.underline {
  text-decoration: underline;
  cursor: pointer;
}
</style>
