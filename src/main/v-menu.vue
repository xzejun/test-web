<template>
  <div>
    <v-header />
    <el-menu :default-active="active"
      :collapse="collapse"
      class="sidebar-el-menu"
      unique-opened
      router
      @select="select">
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index"
            :key="item.key"
            class="hassub">
            <template slot="title">
              <i :class="item.icon" />
              <span slot="title"
                class="menu-title">{{ item.title }}</span>
            </template>
            <template v-for="subs in item.subs">
              <template v-if="subs.subs">
                <el-submenu :index="subs.index"
                  :key="subs.key">
                  <template slot="title">
                    <i :class="subs.icon" />
                    <span slot="title"
                      class="menu-title">{{ subs.title }}</span>
                  </template>
                  <el-menu-item v-for="subItem in subs.subs"
                    :key="subItem.key"
                    :index="subItem.index">
                    <div class="v-menu-item-third">
                      <i :class="subItem.icon" /> {{ subItem.title }}</div>
                  </el-menu-item>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :index="subs.index"
                  :key="subs.index">
                  <div class="v-menu-item-secend">
                    <i :class="subs.icon" />
                    <span slot="title"
                      class="menu-title">{{ subs.title }}</span>
                  </div>
                </el-menu-item>
              </template>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index"
            :key="item.index"
            class="nosub">
            <div class="v-menu-item-first">
              <i :class="item.icon" />
              <span slot="title"
                class="menu-title">{{ item.title }}</span>
            </div>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import vHeader from './v-header.vue';

export default {
  components: {
    vHeader,
  },
  data() {
    return {
      collapse: false,
      active: '',
      items: [
        {
          index: 'test',
          title: 'test',
          subs: [
            {
              index: 'test0',
              title: 'test0',
            },
          ],
        },
        {
          index: 'collection',
          title: '采集数据',
        },
      ],
    };
  },
  methods: {
    select(index) {
      this.active = index;
    },
  },
};
</script>

<style lang="less">
.sidebar-el-menu {
  border: none;
  .el-menu-item,
  .el-submenu {
    background: #e1eaf2;
  }
  .el-submenu__title {
    height: 40px !important;
    line-height: 40px !important;
    background: #e1eaf2;
  }
  .el-menu-item {
    height: 40px !important;
    line-height: 40px !important;
    padding-left: 0 !important;
    .v-menu-item-first {
      padding-left: 20px;
    }
    .v-menu-item-secend {
      padding-left: 40px;
    }
    .v-menu-item-third {
      padding-left: 60px;
    }
  }
  .hassub > .el-submenu__title,
  .nosub.el-menu-item {
    height: 50px;
    line-height: 50px;
    background: #eff4f8;
  }
  .hassub > .el-submenu__title:hover,
  .nosub.el-menu-item:hover {
    color: #1890ff;
    height: 50px;
    line-height: 50px;
    background: #eff4f8;
  }

  .el-menu-item:hover.is-active,
  .el-menu-item.is-active {
    background-color: #1890ff;
    color: #fff;
  }
  .el-submenu__title:hover,
  .el-menu-item:hover {
    color: #1890ff;
    background: #e1eaf2;
  }
}
</style>
<style scoped>
.menu-title {
  margin-left: 5px;
}
</style>
