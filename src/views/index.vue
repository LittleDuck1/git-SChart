<template>
  <el-container class="home-container">
      <!-- 路由占位符 -->
      <keep-alive exclude="VueGirdLayout">
        <router-view></router-view>
      </keep-alive>
  </el-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>

</style>
