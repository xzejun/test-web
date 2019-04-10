<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {};
</script>
<style lang="less">
.input-flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: 24px;
  flex: 1;
  .el-select,
  .el-input,
  .el-cascader {
    width: 100%;
  }
  .flex-list {
    .el-button + .el-button {
      margin-left: 8px;
    }
    width: calc(100% / 3 - 32px);
    margin-top: 24px;
    &:not(:first-child) {
      margin-left: 48px;
    }
    &:nth-of-type(4) {
      margin-left: 0;
    }
    &:nth-last-of-type(1) {
      text-align: right;
    }
    .input-name {
      display: inline-block;
      width: 3em;
      text-align: right;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
    }
    .list-input {
      display: inline-block;
      width: calc(100% - 3em);
      .el-input {
        width: 100%;
      }
    }
  }
}
</style>
