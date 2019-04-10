<template>
  <!-- 标记异常 -->
  <el-dialog :visible.sync="abnormalVisible"
    :before-close="onCancel"
    :title="labelName"
    width="500px">
    <el-form ref="form"
      :model="form"
      :rules="formRules"
      label-width="90px">
      <el-form-item :label="`${labelName}:`"
        prop="content">
        <el-input v-model="form.content"
          placeholder=""
          class="inputWidth" />
      </el-form-item>
    </el-form>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button :disabled="submitDisabled"
        type="primary"
        @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    abnormalVisible: Boolean,
    labelName: String,
    form: Object,
  },
  data() {
    return {
      formRules: {
        content: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
      },
      // 防止确定按钮连击
      submitDisabled: false,
    };
  },
  watch: {
    abnormalVisible(val) {
      if (val) {
        this.submitDisabled = false;
      }
    },
  },
  created() {},
  methods: {
    /* 确定 */
    onSubmit() {
      this.submitDisabled = true;
      this.$emit('onSubmit', this.form.content);
    },
    /* 取消 */
    onCancel() {
      this.$emit('onCancel');
    },
  },
};
</script>
<style lang="less" scoped>
.inputWidth {
  width: 370px;
}
</style>
