<template>
  <el-container class="wraper">
    <el-aside class="aside"
      width="168px">
      <v-menu />
    </el-aside>
    <el-main>
      <div class="content">
        <transition name="move"
          mode="out-in">
          <router-view />
        </transition>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { mapState } from 'vuex';
import vMenu from './v-menu.vue';

export default {
  components: {
    vMenu,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('app', {
      isFullScreen: state => {
        const { isFullScreen = {} } = state;
        return isFullScreen;
      },
    }),
  },
  methods: {
    click() {
      this.getData();
    },
    getData() {},
  },
};
</script>

<style lang="less" scoped>
.wraper {
  height: 100%;
  .aside {
    background: #eff4f8;
    border-right: 1px solid #e8e8e8;
    overflow: hidden;
  }
}
header {
  height: 40px !important;
}
</style>
