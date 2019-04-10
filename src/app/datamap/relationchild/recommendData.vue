<template>
  <!-- 推荐数据 -->
  <div class="recommend">
    <div class="recommend-title floatLeft">推荐数据：</div>
    <div class="recommend-content">
      <div v-for="(item, key) in recommendList"
        :key="key"
        :class="alreadyRelation.id === item.id ? 'recommend-checked' : `recommend-name`"
        @click="recommendCheck(item)">
        {{item.name}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    recommendList: Array,
    alreadyRelation: Object,
  },
  data() {
    return {};
  },
  methods: {
    /* 选择第三方数据 */
    recommendCheck(item) {
      this.$emit('recommendCheck', item);
    },
  },
};
</script>
<style lang="less" scoped>
.recommend {
  width: 600px;
  height: auto;
  margin-top: 50px;
}
.recommend-title {
  display: inline-block;
  width: 70px;
  height: 22px;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
}
.floatLeft {
  float: left;
}
.recommend-content {
  width: 530px;
  display: inline-block;
}
.recommend-name {
  display: inline-block;
  width: auto;
  height: 22px;
  line-height: 22px;
  background: #fff;
  border: 1px solid #d9d9d9;
  font-size: 12px;
  color: #595959;
  padding: 0px 8px;
  margin-left: 8px;
  margin-bottom: 8px;
}
.recommend-name:hover {
  border: 1px solid #1890ff;
  color: #1890ff;
  cursor: pointer;
}
.recommend-checked {
  display: inline-block;
  width: auto;
  height: 22px;
  line-height: 22px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  font-size: 12px;
  color: #bfbfbf;
  padding: 0px 8px;
  margin-left: 8px;
  margin-bottom: 8px;
}
</style>
