<template>
  <!-- 操作 -->
  <div class="three-title">
    <span>{{threeCheckData.name}}</span>
    <div v-if="relationStatus !== '3'"
      class="handles">
      <el-button class="save-button"
        @click="abnormal('2')">标记为异常</el-button>
      <el-button :disabled="nextDisabled"
        type="primary"
        class="save-button"
        @click="nextStep">下一条</el-button>
    </div>
    <div v-if="relationStatus === '3'"
      class="handles">
      <el-button :disabled="nextDisabled"
        type="primary"
        class="save-button"
        @click="pass('1')">通过</el-button>
      <el-button :disabled="nextDisabled"
        class="save-button"
        @click="abnormal('2')">拒绝</el-button>
      <el-button :disabled="nextDisabled"
        class="save-button"
        @click="pass('3')">忽略</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    threeCheckData: Object,
    relationStatus: String,
    nextDisabled: Boolean,
  },
  data() {
    return {};
  },
  methods: {
    abnormal(val) {
      this.$emit('abnormal', val);
    },
    pass(val) {
      this.$emit('pass', val);
    },
    nextStep() {
      this.$emit('nextStep');
    },
  },
};
</script>
<style lang="less" scoped>
.three-title {
  height: 32px;
  font-size: 28px;
  font-weight: 600;
  color: #000;
  line-height: 32px;
  margin-top: 11px;
}
.save-button {
  height: 32px;
  margin-left: 8px;
  width: 100px;
}
.handles {
  float: right;
  margin: 0px 0px 15px;
}
</style>
