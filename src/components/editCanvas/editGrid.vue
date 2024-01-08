<template>
  <div class="grid-wrapper">
    <div class="edit-header">
      <span>
        <el-button @click="ToHome" type="primary" plain class="edit-header-left"
          >返回首页commit2</el-button
        >
        <!-- <el-page-header @back="ToHome"></el-page-header> -->
        <!-- <el-button type="primary" plain class="edit-header-middle"
          >渲染</el-button
        > -->
      </span>
      <el-button
        @click="exportAllChart"
        type="primary"
        class="edit-header-right"
        >发布全部图表</el-button
      >
    </div>
    <div class="edit-wrapper">
      <div class="edit-layout" id="export-area" @click="editTrigger">
        <grid-layout
          id="layout"
          :layout.sync="layout"
          :col-num="12"
          :row-height="30"
          :is-draggable="draggable"
          :is-resizable="resizable"
          :vertical-compact="false"
          :is-mirrored="mirrorable"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in layout"
            :static="item.static"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
            @resize="SizeAutoChange(item.i)"
          >
            <!-- 当 grid-item 改变时执行 SizeAutoChange() 函数  -->
            <div
              :class="{ active: isActive === item.i }"
              :ref="'chart' + item.i"
              :id="'chart' + item.i"
              :tabIndex="-1"
              @click="handleEcharts(item.i)"
              :style="{ width: '100%', height: '100%' }"
            >
              >
            </div>
            <!-- 设定好 ref 使得下面操控的是某个子组件的函数 -->
          </grid-item>
        </grid-layout>
      </div>
      <div class="config-layout" @click="configTrigger">
        <div class="edit-config" v-if="isEditConfig === true">
          <div class="edit-config-title">
            <span>图表配置11</span>
          </div>
          <div class="edit-config-item">
            <span>图表标题22</span>
            <el-input
              @input="setTitle()"
              v-model="tableTitle"
              placeholder="请输入图表标题"
              style="width: 200px"
            ></el-input>
          </div>
          <div class="edit-config-item">
            <span>背景颜色33</span>
            <el-color-picker
              v-model="bgColor"
              @change="changeColor()"
            ></el-color-picker>
          </div>
          <div class="edit-config-item" v-if="ismainColor === true">
            <span>主题颜色</span>
            <el-color-picker
              v-model="mainColor"
              @change="setColor()"
            ></el-color-picker>
          </div>
          <div class="edit-config-item">
            <span>x轴配置</span>
            <el-checkbox
              v-model="fontItalics"
              class="custom-box"
              @change="handleFontx()"
              >x轴字体倾斜</el-checkbox
            >
            <el-checkbox
              v-model="showxAxis"
              class="custom-box"
              @change="handleShowx()"
              >显示x轴</el-checkbox
            >
          </div>
          <div style="padding-left: 104px">
            <el-checkbox
              v-model="reversexAxis"
              class="custom-box"
              style="padding-right: 25px"
              @change="handleReversex()"
              >x轴反向</el-checkbox
            >
            <el-checkbox
              v-model="labelxAxis"
              class="custom-box"
              @change="handleLabelx()"
              >x轴标签</el-checkbox
            >
          </div>
          <div class="edit-config-item" v-if="isDoubley === false">
            <span>y轴配置</span>
            <el-checkbox
              v-model="fontItalicsy"
              class="custom-box"
              @change="handleFonty()"
              >y轴字体倾斜</el-checkbox
            >
            <el-checkbox
              v-model="showyAxis"
              class="custom-box"
              @change="handleShowy()"
              >显示y轴</el-checkbox
            >
          </div>
          <div style="padding-left: 104px" v-if="isDoubley === false">
            <el-checkbox
              v-model="reverseyAxis"
              class="custom-box"
              style="padding-right: 25px"
              @change="handleReversey()"
              >y轴反向</el-checkbox
            >
            <el-checkbox
              v-model="labelyAxis"
              class="custom-box"
              @change="handleLabely()"
              >y轴标签</el-checkbox
            >
          </div>
          <div class="edit-config-item" v-if="isDoubley === true">
            <span>左y轴配置</span>
            <el-checkbox
              v-model="fontItalicsyLeft"
              class="custom-box"
              @change="handleFontyLeft()"
              >y轴字体倾斜</el-checkbox
            >
            <el-checkbox
              v-model="showyAxisLeft"
              class="custom-box"
              @change="handleShowyLeft()"
              >显示y轴</el-checkbox
            >
          </div>
          <div style="padding-left: 104px" v-if="isDoubley === true">
            <el-checkbox
              v-model="reverseyAxisLeft"
              class="custom-box"
              style="padding-right: 25px"
              @change="handleReverseyLeft()"
              >y轴反向</el-checkbox
            >
            <el-checkbox
              v-model="labelyAxisLeft"
              class="custom-box"
              @change="handleLabelyLeft()"
              >y轴标签</el-checkbox
            >
          </div>
          <div class="edit-config-item" v-if="isDoubley === true">
            <span>右y轴配置</span>
            <el-checkbox
              v-model="fontItalicsyRight"
              class="custom-box"
              @change="handleFontyRight()"
              >y轴字体倾斜</el-checkbox
            >
            <el-checkbox
              v-model="showyAxisRight"
              class="custom-box"
              @change="handleShowyRight()"
              >显示y轴</el-checkbox
            >
          </div>
          <div style="padding-left: 104px" v-if="isDoubley === true">
            <el-checkbox
              v-model="reverseyAxisRight"
              class="custom-box"
              style="padding-right: 25px"
              @change="handleReverseyRight()"
              >y轴反向</el-checkbox
            >
            <el-checkbox
              v-model="labelyAxisRight"
              class="custom-box"
              @change="handleLabelyRight()"
              >y轴标签</el-checkbox
            >
          </div>
        </div>
        <div class="edit-config" v-else>
          <!-- <p>页面配置</p> -->
          <div class="edit-config-title">
            <span>页面配置</span>
          </div>
          <div class="edit-config-item">
            <span>拖拽设置</span>
            <el-checkbox v-model="draggable" class="custom-box"
              >是否拖拽</el-checkbox
            >
          </div>
          <div class="edit-config-item">
            <span>尺寸设置</span>
            <el-checkbox v-model="resizable" class="custom-box"
              >是否调整大小</el-checkbox
            >
          </div>
          <div class="edit-config-item">
            <span>反转设置</span>
            <el-checkbox v-model="mirrorable" class="custom-box"
              >是否可镜像反转</el-checkbox
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { GridLayout, GridItem } from "vue-grid-layout"; //引入组件
import html2canvas from "html2canvas";
import debounce from "lodash/debounce";
import JsPDF from "jspdf";
import throttle from "lodash/debounce";
export default {
  name: "VueGirdLayout", //注册组件
  components: {
    GridLayout,
    GridItem,
  },
  data() {
    return {
      whoTrigger: "",
      // options: [],
      layout: [],
      AllCharts: [],
      draggable: true, //是否可拖拽
      resizable: true, //是否可更改大小
      mirrorable: false, //是否可镜像反转
      myChart: [],
      tableTitle: "",
      bgColor: "#ffffff",
      mainColor: "#409EFF",
      ismainColor: true,
      //x轴配置
      fontItalics: false,
      showxAxis: true,
      labelxAxis: true,
      reversexAxis: false,
      //y轴配置
      fontItalicsy: false,
      showyAxis: true,
      reverseyAxis: false,
      labelyAxis: true,
      isActive: "",
      isEditConfig: false,
      //是否为双y轴
      isDoubley: false,
      //左侧y轴
      fontItalicsyLeft: false,
      showyAxisLeft: true,
      reverseyAxisLeft: false,
      labelyAxisLeft: true,
      //右侧y轴
      fontItalicsyRight: false,
      showyAxisRight: true,
      reverseyAxisRight: false,
      labelyAxisRight: true,
      flagList: [],
      //数值配置
      isShowItem: false
    };
  },
  computed: {
    options() {
      return this.$store.state.options;
    },
  },
  mounted() {
    // console.log("this.options", this.$store.state.options);
    console.log("this.options", this.options);
    this.initCharts();
  },
  methods: {
    ToHome() {
      this.$router.push({ path: "home" });
    },
    initCharts() {
      console.log(this.options);
      let layout = [];
      for (let j = 0; j < this.options.length; j++) {
        layout.push({
          x: 0 + 2 * j,
          y: 0,
          w: 4,
          h: 6,
          i: j.toString(),
          static: false,
        });
      }
      this.layout = layout;
      this.options.forEach((option, index) => {
        this.$nextTick(() => {
          const chart = this.$echarts.init(
            document.getElementById("chart" + index)
          );
          this.AllCharts.push(chart);
          //清空画布
          chart.clear();
          chart.showLoading({
            text: "loading",
            color: "#c23531",
            textColor: "#000",
            maskColor: "rgba(255, 255, 255, 0.2)",
            zlevel: 0,
          });
          setTimeout(() => {
            //setOption前隐藏loading事件
            chart.hideLoading();
            chart.setOption(option);
          }, 1000);
          setTimeout(() => {
            //由于网格布局拖拽放大缩小图表不能自适应，这里设置一个定时器使得echart加载为一个异步过程
            this.$nextTick(() => {
              chart.resize();
            });
          }, 0);
        });
      });
    },
    changeCharts(index, option) {
      const chart = this.$echarts.init(
        document.getElementById("chart" + index)
      );
      chart.setOption(option);
      setTimeout(() => {
        //由于网格布局拖拽放大缩小图表不能自适应，这里设置一个定时器使得echart加载为一个异步过程
        this.$nextTick(() => {
          chart.resize();
        });
      }, 0);
    },
    //失去焦点时，返回到页面配置
    // getBlur(index) {
    //   console.log(this.whoTrigger);
    //   setTimeout(() => {
    //     if (this.whoTrigger == "edit") {
    //       this.flagList.pop();
    //       console.log("失去焦点事件", index, this.flagList);
    //       if (this.flagList.length === 0) {
    //         //开启页面配置界面
    //         this.isEditConfig = false;
    //         //取消图表的选中
    //         this.isActive = "";
    //       }
    //     }
    //   }, 0);
    // },
    handleEcharts(index) {
      this.isActive = index;
      console.log("11111", this.options[this.isActive]);
      //处理标题
      if (this.options[this.isActive] && this.options[this.isActive].title) {
        this.tableTitle = this.options[this.isActive].title.text;
      } else {
        this.tableTitle = "";
      }
      //处理数值显示
      if (this.options[this.isActive] && this.options[this.isActive].series && this.options[this.isActive].series[0].itemStyle && this.options[this.isActive].series[0].itemStyle.normal) {
        let normal = this.options[this.isActive].series[0].itemStyle.normal;
        if (normal && normal.label && normal.label.show) {
          this.isShowItem = normal.label.show;
        }
      }else {
        this.isShowItem = false;
      }
      //处理背景颜色和主题颜色
      if (
        this.options[this.isActive] &&
        this.options[this.isActive].backgroundColor
      ) {
        this.bgColor = this.options[this.isActive].backgroundColor;
      } else {
        this.bgColor = "#ffffff";
      }
      if (this.options[this.isActive] && this.options[this.isActive].color) {
        let target = this.options[this.isActive].color;
        if (Array.isArray(target)) {
          this.ismainColor = false;
        } else {
          this.mainColor = this.options[this.isActive].color;
        }
      } else {
        this.mainColor = "#409EFF";
      }
      //处理x轴
      if (
        this.options[this.isActive] &&
        this.options[this.isActive].xAxis &&
        Array.isArray(this.options[this.isActive].xAxis)
      ) {
        console.log("x轴是数组");
        let xAxisArr = this.options[this.isActive].xAxis;
        let xAxisObj = xAxisArr.flat(Infinity);
        this.options[this.isActive].xAxis = xAxisObj[0];
      }
      //单个y轴时
      if (
        this.options[this.isActive] &&
        this.options[this.isActive].yAxis &&
        !Array.isArray(this.options[this.isActive].yAxis)
      ) {
        let yAxis = this.options[this.isActive].yAxis;
        if (yAxis.axisLine && yAxis.axisLine.show) {
          this.showyAxis = true;
        } else {
          this.showyAxis = false;
        }
      }
      //双y轴时
      if (
        this.options[this.isActive] &&
        this.options[this.isActive].yAxis &&
        Array.isArray(this.options[this.isActive].yAxis)
      ) {
        this.isDoubley = true;
        let yAxisLeft = this.options[this.isActive].yAxis[0];
        let yAxisRight = this.options[this.isActive].yAxis[1];
        //左侧y轴
        if (yAxisLeft && yAxisLeft.axisLine && yAxisLeft.axisLine.show) {
          this.showyAxisLeft = true;
        } else {
          this.showyAxisLeft = false;
        }
        //右侧y轴
        if (yAxisRight && yAxisRight.axisLine && yAxisRight.axisLine.show) {
          this.showyAxisRight = true;
        } else {
          this.showyAxisRight = false;
        }
      }
      this.isEditConfig = true;
      this.flagList.push(true);
    },
    editTrigger() {
      this.whoTrigger = "edit";
    },
    configTrigger() {
      this.whoTrigger = "config";
    },
    setTitle() {
      this.$set(this.options[this.isActive], "title", {
        text: this.tableTitle,
      });
      this.changeCharts(this.isActive, this.options[this.isActive]);
    },
     //显示数值
     showItems () {
      if (this.isShowItem) {
        const option = this.options[this.isActive];
        if (Array.isArray(option.series)) {
          option.series.map((item) => {
            this.$set(item, "itemStyle", {normal: {label : {show: true}}});
          })
        }
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }else {
        const option = this.options[this.isActive];
        if (Array.isArray(option.series)) {
          option.series.map((item) => {
            this.$set(item, "itemStyle", {normal: {label : {show: false}}});
          })
        }
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    // 背景颜色
    changeColor() {
      this.$set(this.options[this.isActive], "backgroundColor", this.bgColor);
      this.changeCharts(this.isActive, this.options[this.isActive]);
    },
    // 主题颜色
    setColor() {
      this.$set(this.options[this.isActive], "color", this.mainColor);
      // this.options[this.isActive].color = this.mainColor;
      this.changeCharts(this.isActive, this.options[this.isActive]);
    },
    handleFontx() {
      if (this.fontItalics) {
        this.$set(this.options[this.isActive].xAxis, "axisLabel", {
          rotate: 50,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].xAxis, "axisLabel", {
          rotate: 0,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleFonty() {
      if (this.fontItalicsy) {
        this.$set(this.options[this.isActive].yAxis, "axisLabel", {
          rotate: 50,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis, "axisLabel", {
          rotate: 0,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleFontyLeft() {
      if (this.fontItalicsyLeft) {
        this.$set(this.options[this.isActive].yAxis[0], "axisLabel", {
          rotate: 50,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis[0], "axisLabel", {
          rotate: 0,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleFontyRight() {
      if (this.fontItalicsyRight) {
        this.$set(this.options[this.isActive].yAxis[1], "axisLabel", {
          rotate: 50,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis[1], "axisLabel", {
          rotate: 0,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleShowx() {
      if (this.showxAxis) {
        this.$set(this.options[this.isActive].xAxis, "axisLine", {
          show: true,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].xAxis, "axisLine", {
          show: false,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleShowy() {
      if (this.showyAxis) {
        this.$set(this.options[this.isActive].yAxis, "axisLine", {
          show: true,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis, "axisLine", {
          show: false,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleShowyLeft() {
      if (this.showyAxisLeft) {
        this.$set(this.options[this.isActive].yAxis[0], "axisLine", {
          show: true,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis[0], "axisLine", {
          show: false,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleShowyRight() {
      if (this.showyAxisRight) {
        this.$set(this.options[this.isActive].yAxis[1], "axisLine", {
          show: true,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis[1], "axisLine", {
          show: false,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleLabelx() {
      if (this.labelxAxis) {
        this.$set(this.options[this.isActive].xAxis, "axisLabel", {
          show: true,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].xAxis, "axisLabel", {
          show: false,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleLabely() {
      if (this.labelyAxis) {
        this.$set(this.options[this.isActive].yAxis, "axisLabel", {
          show: true,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis, "axisLabel", {
          show: false,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleLabelyLeft() {
      if (this.labelyAxisLeft) {
        this.$set(this.options[this.isActive].yAxis[0], "axisLabel", {
          show: true,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis[0], "axisLabel", {
          show: false,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleLabelyRight() {
      if (this.labelyAxisRight) {
        this.$set(this.options[this.isActive].yAxis[1], "axisLabel", {
          show: true,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis[1], "axisLabel", {
          show: false,
        });
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleReversex() {
      if (this.reversexAxis) {
        this.$set(this.options[this.isActive].xAxis, "inverse", true);
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].xAxis, "inverse", false);
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleReversey() {
      if (this.reverseyAxis) {
        this.$set(this.options[this.isActive].yAxis, "inverse", true);
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis, "inverse", false);
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleReverseyLeft() {
      if (this.reverseyAxisLeft) {
        this.$set(this.options[this.isActive].yAxis[0], "inverse", true);
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis[0], "inverse", false);
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    handleReverseyRight() {
      if (this.reverseyAxisRight) {
        this.$set(this.options[this.isActive].yAxis[1], "inverse", true);
        this.changeCharts(this.isActive, this.options[this.isActive]);
      } else {
        this.$set(this.options[this.isActive].yAxis[1], "inverse", false);
        this.changeCharts(this.isActive, this.options[this.isActive]);
      }
    },
    sizechange(index) {
      console.log("sizechange", index);
      this.AllCharts[index].resize();
    },
    SizeAutoChange(ChartId) {
      let that = this;
      throttle(function () {
        that.sizechange(ChartId);
      }, 300)();
    },
    exportAllChart() {
      let targetDom = document.getElementById("export-area");

      let domScrollHeight =
        document.getElementById("layout").scrollHeight + 200;
      console.log("targetDom.scrollHeight", domScrollHeight);
      targetDom.setAttribute("style", `height: ${domScrollHeight}px;`);
      html2canvas(targetDom, {
        scale: window.devicePixelRatio,
      }).then(function (canvas) {
        // var img = canvas
        //   .toDataURL("image/png")
        //   .replace("image/png", "image/octet-stream");
        // // 创建a标签，实现下载
        // var creatIMg = document.createElement("a");
        // creatIMg.download = "导出图表.png"; // 设置下载的文件名，
        // creatIMg.href = img; // 下载url
        // document.body.appendChild(canvas);
        // creatIMg.click();
        // creatIMg.remove(); // 下载之后把创建的元素删除
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;

        //一页pdf显示html页面生成的canvas高度;
        let pageHeight = (contentWidth / 595.28) * 841.89;
        //未生成pdf的html页面高度
        let leftHeight = contentHeight;
        //pdf页面偏移
        let position = 0;
        //html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
        let imgWidth = 595.28;
        let imgHeight = (595.28 / contentWidth) * contentHeight;

        let pageData = canvas.toDataURL("image/jpeg", 1);
        let pdf = new JsPDF("", "pt", "a4");

        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            //避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }
        pdf.save(`TestReport.pdf`);
        targetDom.setAttribute("style", `height: 100%;`);
      });
    },
  },
};
</script>
  
<style lang="scss" scoped>
body {
  margin: 0;
}
.vue-grid-layout {
  // background: #eee;
  // height: 95% !important;
  height: 91% !important;
  margin: 25px;
  margin-bottom: 0px;
  box-shadow: 0 0 10px rgb(185, 185, 185);
  background-image: url("../../../src/assets/grid.svg");
  overflow: auto;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: rgb(255, 255, 255);
}
.vue-grid-item .static {
  background: #cce;
}
.grid-wrapper {
  width: 100%;
  height: 98vh;
}
// 左边自适应，右边固定宽度
.edit-wrapper {
  width: 100%;
  display: flex;
  height: 93vh;
}
.edit-header {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding: 15px;
  span {
    display: flex;
    align-items: center;
  }
}
.edit-layout {
  flex: 1;
  height: 100%;
  border-top: 1px solid #d7dde4;
}
.edit-config {
  width: 330px;
  height: 93%;
  background-color: #fff;
  border: 1px solid #d7dde4;
  &-item {
    display: flex;
    align-items: center;
    height: 40px;
    margin-top: 10px;
    padding-left: 15px;
    span {
      width: 90px;
      // padding-right: 15px;
      font-weight: 550;
    }
  }
  &-title {
    text-align: center;
    border-bottom: 1px solid #d7dde4;
    height: 50px;
    line-height: 50px;
    margin-bottom: 20px;
    span {
      padding: 13px 0;
      border-bottom: 2px solid #298dff;
    }
  }
}
.custom-box .el-checkbox__label {
  font-size: 18px; /* 设置字体大小 */
}
.el-checkbox__label {
  font-size: 18px !important; /* 设置字体大小 */
}
.active {
  border: 1px dashed #409eff;
}
</style>
  