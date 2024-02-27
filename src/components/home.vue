<template>
  <div class="page">
    <LayOutVue></LayOutVue>
  </div>
</template>

<script>
import LayOutVue from "./editCanvas/LayOut.vue";

export default {
  components: {
    LayOutVue,
    bindClass: "el-icon-mic",
  },
  data() {
    return {};
  },
  mounted() {
    console.log('home--mounted')
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.page {
  width: 98vw;
  height: 97vh;
}
</style>
