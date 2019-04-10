<template>
  <!-- 第三方数据展示 -->
  <div class="relation-left">
    <el-tabs v-model="activeName"
      @tab-click="activeClick">
      <el-tab-pane :label="`全部(${allNum})`"
        class="relation-left-scroll"
        name="a">
        <div v-for="(val1, key1) in allList"
          :key="key1"
          :class="`${val1.id === threeCheckData.id ? 'three-checked' : ''} three-content`"
          @click="threeCheck(val1)">{{val1.name}}
          <!-- 关联 -->
          <div v-if="relationStatus === '1' && val1.editStatus === '1'"
            class="three-already-relation">已关联</div>
          <div v-if="relationStatus === '1' && val1.editStatus === '2'"
            class="three-abnormal">异常</div>
          <!-- 修订 -->
          <div v-if="relationStatus === '2' && val1.checkStatus === '1'"
            class="three-pass">通过</div>
          <div v-if="relationStatus === '2' && val1.checkStatus === '2'"
            class="three-abnormal">拒绝</div>
          <!-- 3忽略按通过处理 -->
          <div v-if="relationStatus === '3' && val1.checkStatus === '1'"
            class="three-pass">通过</div>
          <div v-if="relationStatus === '3' && val1.checkStatus === '3'"
            class="three-pass">忽略</div>
          <div v-if="relationStatus === '3' && val1.checkStatus === '2'"
            class="three-abnormal">拒绝</div>
          <!-- 审核时把关联异常标记出来 -->
          <div v-if="relationStatus === '3' && val1.checkStatus === '0' && val1.editStatus === '2'"
            class="three-abnormal">异常</div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="relationStatus === '1'"
        :label="`未关联(${norelationNum})`"
        class="relation-left-scroll"
        name="b">
        <div v-for="(val1, key1) in norelationList"
          :key="key1"
          :class="`${val1.id === threeCheckData.id ? 'three-checked' : ''} three-content`"
          @click="threeCheck(val1)">{{val1.name}}
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="relationStatus === '1'"
        :label="`异常(${abnormalNum})`"
        class="relation-left-scroll"
        name="c">
        <div v-for="(val1, key1) in abnormalList"
          :key="key1"
          :class="`${val1.id === threeCheckData.id ? 'three-checked' : ''} three-content`"
          @click="threeCheck(val1)">{{val1.name}}
          <div class="three-abnormal">异常</div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="relationStatus === '2'"
        :label="`拒绝(${refuseNum})`"
        class="relation-left-scroll"
        name="d">
        <div v-for="(val1, key1) in refuseList"
          :key="key1"
          :class="`${val1.id === threeCheckData.id ? 'three-checked' : ''} three-content`"
          @click="threeCheck(val1)">{{val1.name}}
          <div class="three-abnormal">拒绝</div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="relationStatus === '3'"
        :label="`未审核(${checkNum})`"
        class="relation-left-scroll"
        name="e">
        <div v-for="(val1, key1) in checkList"
          :key="key1"
          :class="`${val1.id === threeCheckData.id ? 'three-checked' : ''} three-content`"
          @click="threeCheck(val1)">{{val1.name}}
          <div class="three-abnormal">未审核</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import _ from 'lodash';

export default {
  props: {
    relationStatus: String,
    threeCheckData: Object,
    allList: Array,
    allNum: Number,
    norelationList: Array,
    norelationNum: Number,
    abnormalList: Array,
    abnormalNum: Number,
    refuseList: Array,
    refuseNum: Number,
    checkList: Array,
    checkNum: Number,
  },
  data() {
    return {
      activeName: 'b',
    };
  },
  created() {
    // 根据当前操作确定默认哪个
    if (this.relationStatus === '1') {
      this.activeName = 'b';
    } else if (this.relationStatus === '2') {
      this.activeName = 'd';
    } else {
      this.activeName = 'e';
    }
  },
  methods: {
    // 切换状态
    activeClick() {
      // 更新第三方已选中数据
      // a所有, b未关联, c异常, d拒绝, e未审核
      let threeCheckData = {};
      switch (this.activeName) {
        case 'a':
          threeCheckData = _.head(this.allList) || {};
          break;
        case 'b':
          threeCheckData = _.head(this.norelationList) || {};
          break;
        case 'c':
          threeCheckData = _.head(this.abnormalList) || {};
          break;
        case 'd':
          threeCheckData = _.head(this.refuseList) || {};
          break;
        case 'e':
          threeCheckData = _.head(this.checkList) || {};
          break;
        default:
          break;
      }
      this.$emit('activeClick', { activeName: this.activeName, threeCheckData });
    },
    threeCheck(val) {
      this.$emit('threeCheck', val);
    },
  },
};
</script>
<style lang="less" scoped>
.relation-left {
  float: left;
  width: 296px;
  padding: 0px 24px 12px;
  // height: 553px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid #e8e8e8;
}
.relation-left-scroll {
  max-height: 690px;
  overflow-y: auto;
}
/*滚动条样式*/
.relation-left-scroll::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.relation-left-scroll::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.three-content {
  height: 36px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 36px;
  margin-bottom: 20px;
  padding-left: 8px;
}
.three-content:hover {
  color: #1890ff;
  background: #e8f5ff;
  cursor: pointer;
}
// 第三方知识点选中状态
.three-checked {
  color: #1890ff;
  background: #e8f5ff;
  cursor: pointer;
}
.three-abnormal {
  float: right;
  width: 38px;
  text-align: center;
  height: 22px;
  line-height: 22px;
  background: #fff1f0;
  border: 1px solid #ffa39e;
  font-size: 12px;
  color: #f5222d;
  margin-top: 7px;
  margin-right: 33px;
}

.three-pass {
  float: right;
  width: 38px;
  text-align: center;
  height: 22px;
  line-height: 22px;
  background: #f0fff7;
  border: 1px solid #83f7b7;
  font-size: 12px;
  color: #13ce66;
  margin-top: 7px;
  margin-right: 33px;
}
.three-already-relation {
  float: right;
  width: 54px;
  text-align: center;
  height: 22px;
  line-height: 22px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  font-size: 12px;
  color: #1890ff;
  margin-top: 7px;
  margin-right: 18px;
}
</style>
