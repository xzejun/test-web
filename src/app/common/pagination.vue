<template>
  <el-pagination :total="total"
    :page-size="pageSize"
    :page-sizes="pageSizes"
    :current-page="currentPage"
    :layout="layout"
    class="pagination"
    background
    @current-change="currentChange"
    @size-change="sizeChange" />
</template>

<script>
export default {
  props: {
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100];
      },
    },
    currentPage: Number,
    pageSize: {
      type: Number,
      default() {
        return 20;
      },
    },
    layout: {
      type: String,
      default() {
        return 'total, prev, pager, next, sizes, jumper';
      },
    },
    total: Number,
  },
  data() {
    return {};
  },
  methods: {
    currentChange(...args) {
      this.$emit('current-change', ...args);
    },
    sizeChange(...args) {
      this.$emit('size-change', ...args);
    },
  },
};
</script>

<style>
</style>
