<template>
  <div class="login-wrap">
    <div class="ms-title">XX应用系统</div>
    <div class="ms-login">
      <el-form ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="0px"
        class="demo-ruleForm">
        <el-form-item prop="token">
          <el-input v-model="ruleForm.token"
            :rows="5"
            type="textarea"
            placeholder="token" />
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary"
            @click="submitForm('ruleForm')">输入测试密钥</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        token: '',
      },
      rules: {
        token: [{ required: true, message: '输入测试密钥', trigger: 'blur' }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          localStorage.token = this.ruleForm.token;
          this.$router.push('/datamap/index');
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
</style>
