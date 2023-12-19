<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
  // 禁止web端屏幕缩放
  created() {
    window.addEventListener(
      "mousewheel",
      function (event) {
        if (event.ctrlKey === true || event.metaKey) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
  },
  mounted() {
    document.body.style.zoom = 1;
  },
  methods: {
  },
};
</script>

<!-- <style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333333;
  min-width: 1200px;
  scale: 1;
}
</style> -->
