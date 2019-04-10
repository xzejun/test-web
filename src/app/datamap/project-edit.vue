<template>
  <!-- 修改密码 -->
  <el-dialog :visible.sync="visible"
    :before-close="onCancel"
    :title="title"
    append-to-body
    width="800px">
    <el-form ref="form"
      :rules="formRules"
      :model="form"
      label-width="100px">
      <el-form-item label="项目名称:"
        prop="name">
        <el-input v-model="form.name"
          placeholder="输入名称"
          class="inputStyle" />
      </el-form-item>
      <el-form-item label="关联类型:"
        prop="datatypes">
        <el-select v-model="form.datatypes"
          :filter-method="filterMethod"
          placeholder="选择关联类型"
          multiple
          filterable
          reserve-keyword
          default-first-option
          class="inputStyle">
          <el-option v-for="item in dataTypeShow"
            :key="item.code"
            :label="item.name"
            :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注:"
        prop="comment">
        <el-input v-model="form.comment"
          placeholder="输入备注"
          class="inputStyle" />
      </el-form-item>
    </el-form>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary"
        @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
// import _ from 'lodash';
// import { projectDataTypeGet } from '../api';

export default {
  props: {
    title: String,
    visible: Boolean,
    editorData: Object,
    dataTypeData: Array,
  },

  data() {
    return {
      form: {},
      keyword: '',
      formRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        datatypes: [{ required: true, message: '请选择关联类型', trigger: 'change' }],
      },
    };
  },
  computed: {
    dataTypeShow() {
      if (!this.keyword) {
        return this.dataTypeData;
      }
      const words = this.keyword.split(/\s/g).filter(i => i);
      let res = this.dataTypeData;
      for (let index = 0; index < words.length; index++) {
        const word = words[index];
        res = res && res.filter(({ name } = {}) => name && name.indexOf(word) >= 0);
      }
      return res;
    },
  },
  watch: {
    editorData(val) {
      this.form = { ...val };
    },
    visible(val) {
      if (val) {
        //
      }
    },
  },
  methods: {
    /* 取消 */
    onCancel() {
      this.keyword = '';
      this.$refs.form.resetFields();
      this.$emit('onCancel');
    },
    /* 确定 */
    onSubmit() {
      this.keyword = '';
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('onSubmit', this.form);
          this.$refs.form.resetFields();
          this.onCancel();
        }
      });
    },
    filterMethod(keyword) {
      this.keyword = keyword;
    },
  },
};
</script>
<style lang="less" scoped>
.inputStyle {
  width: 600px;
}
</style>
