<template>
  <div class="data-import">
    <!-- 导入数据 -->
    <importData :props-data="propsData"
      @importData="importData" />
  </div>
</template>
<script>
import { updateTag } from 'util';
import { getApiUrl } from 'util/request';
import importData from '../common/import';
import { dataImport } from '../api';

export default {
  components: {
    importData,
  },
  data() {
    const { projectId = '', datatype = '' } = this.$route.params;
    return {
      projectId,
      datatype,
      propsData: {},
      url: `${getApiUrl()}/base/importFile`,
    };
  },
  created() {
    this.propsData = {
      name: '第三方关联',
      url: this.url,
      file: '/files/导入关联数据.xlsx',
      fileName: '导入关联数据',
      errData: [],
      description: ['编码', '内容，必填（分为：知识点、各种字典数据）'],
    };
  },
  methods: {
    /* 执行导入 */
    importData(fileData) {
      dataImport({ data: fileData, projectId: this.projectId, datatype: this.datatype }).then(({ err, data }) => {
        if (!err) {
          const { msg, err: errData } = data;
          if (msg) {
            this.$message.success(msg);
            updateTag({
              name: '查看项目',
              cmd: 'closeUpdateTag',
              from: `/datamap/importData/${this.projectId}/${this.datatype}`,
              to: `/datamap/see/${this.projectId}`,
              appPath: window.location.pathname,
            });
          } else {
            this.propsData.errData = errData;
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.data-import {
  font-size: 14px;
}
</style>
