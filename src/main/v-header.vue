<template>
  <div class="user-info">
    <el-dropdown trigger="click"
      @command="handleCommand">
      <span class="el-dropdown-link">
        欢迎您，程序猿！
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  methods: {
    handleCommand(command) {
      if (command === 'loginout') {
        localStorage.removeItem('ms_username');
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style lang="less">
.user-info {
  color: #000;
  cursor: pointer;
  .el-dropdown {
    padding: 0 5px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    width: 168px;
  }
  .el-dropdown:hover,
  .el-dropdown:focus {
    background-color: #e1eaf2;
    outline: none;
  }
}
.el-dropdown-link {
  color: #000;
}
.el-icon-arrow-down {
  font-size: 10px;
}
</style>
