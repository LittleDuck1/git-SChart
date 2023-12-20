<template>
  <div class="lay-wrapper" style="padding: 10px; margin-bottom: 50px">
    <div class="history">
      <div class="history-card" id="his-list">
        <div class="history-title">
          <i class="el-icon-s-order" style="margin-right: 10px"></i>
          历史记录111
        </div>
        <!-- 新建对话 -->
        <div style="cursor: pointer">
          <div class="history-add" @click="handleAddHistory">
            <i style="margin-right: 7px" class="el-icon-plus"></i> 新建对话
          </div>
        </div>
        <!-- 搜索 -->
        <div class="serachHistory">
          <el-input
            clearable
            placeholder="请输入关键词"
            v-model="searchInput"
            class="input-with-select"
            suffix-icon="el-icon-search"
            @input="handleSearchChange"
            @clear="handleClear"
          >
          </el-input>
        </div>
        <!-- 历史记录列表 -->
        <el-menu class="history-menu" :default-active="selectHistoryId">
          <el-menu-item
            class="history-list-wrapper"
            v-for="history in historyList"
            :key="history.id"
            @click="handleClick(history.id)"
            :index="history.id.toString()"
          >
            <i
              class="el-icon-chat-dot-round"
              style="margin-left: 10px; font-size: 16px; cursor: pointer"
            ></i>
            <div class="history-title-span">
              <div class="noteSpan">{{ history.note }}</div>
              <div class="timeSpan">{{ history.updateTime }}</div>
            </div>
            <i
              class="el-icon-delete"
              style="margin-left: 10px; font-size: 16px; cursor: pointer"
              @click="handleClose(history.id)"
            ></i>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="chat">
      <div
        class="out-wrapper"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.3)"
      >
        <div
          style="
            text-align: center;
            line-height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <el-switch
            style="
              position: relative;
              right: 180px;
              width: 120px;
              margin-left: 20px;
            "
            v-model="devMode"
            active-color="#13ce66"
            active-text="开发者模式"
          >
          </el-switch>
          <el-select
            style="
              position: relative;
              right: 150px;
              width: 150px;
              margin-left: 20px;
            "
            class="select-model"
            v-model="modelValue"
            placeholder="请选择大模型"
          >
            <el-option
              v-for="item in modelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            style="
              position: relative;
              right: 120px;
              width: 150px;
              margin-left: 20px;
            "
            class="select-model"
            v-model="dialogModel"
            placeholder="请选择对话模式"
            @change="handleSelectModeChange"
          >
            <el-option
              v-for="item in dialogOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="afx-content">
            <img src="@/assets/hs-logo1.png" class="canvas-bg" alt="" />
          </div>
          <span class="titleFont">智能图表引擎</span>
          <el-button class="save-button" type="primary" @click="handleMutiEdit"
            >多选编辑</el-button
          >
          <el-button
            class="save-button"
            type="primary"
            @click="handleOpenDialog"
            >保存对话</el-button
          >
          <el-button
            class="save-button"
            type="warning"
            @click="handleClearHistory"
            >清空对话</el-button
          >
        </div>

        <!-- 聊天内容框 -->
        <div
          id="message-scroll-area"
          style="
            height: 75vh;
            overflow-y: auto;
            border-top: 1px solid #ccc;
            color: black;
          "
        >
          <div
            class="message-wrapper"
            v-for="(message, index) in messages"
            :key="index"
          >
            <!-- 用户消息框 -->

            <div
              class="el-row"
              style="
                padding: 5px 0;
                margin-top: 10px;
                margin-bottom: 10px;
                margin-right: 0px;
              "
              v-if="message.user == 'user'"
            >
              <div
                class="el-col el-col-21"
                style="text-align: right; padding-right: 10px"
              >
                <div class="time-span" style="color: gray; font-size: 15px">
                  <span>{{ message.time }}</span>
                </div>
                <el-popover placement="top-end" trigger="hover">
                  <i
                    class="el-icon-edit message-extend"
                    style="margin-left: 40px; font-size: 25px"
                    @click="handleEditMessage(message.text)"
                  ></i>
                  <i
                    class="el-icon-document-copy message-extend"
                    style="margin-left: 20px; font-size: 25px"
                    @click="handleCopyMessage(message.text)"
                  ></i>
                  <div slot="reference" class="tip left" style="color: black">
                    {{ message.text }}
                  </div>
                </el-popover>
              </div>
              <div class="el-col el-col-2">
                <span
                  class="el-avatar el-avatar--circle"
                  style="height: 40px; width: 40px; line-height: 40px"
                >
                  <img src="@/assets/user.jpg" style="object-fit: cover" />
                </span>
              </div>
            </div>

            <!-- 大模型消息框 -->
            <el-checkbox-group
              v-model="checkedOptions"
              @change="handleCheckChange"
              v-else
            >
              <div class="el-row llm-message-row" style="padding: 5px 0">
                <div
                  class="el-col el-col-2 llm-checkstyle"
                  style="text-align: right"
                >
                  <!-- 复选框，支持多编辑 -->
                  <el-checkbox
                    class="message-checkbox"
                    :key="message.optId"
                    :label="message.text"
                    ><br
                  /></el-checkbox>
                  <span
                    class="el-avatar el-avatar--circle"
                    style="height: 40px; width: 40px; line-height: 40px"
                  >
                    <!-- <img
                      src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                      style="object-fit: cover"
                    /> -->
                    <img
                      src="@/assets/hs1.png"
                      style="object-fit: cover"
                      alt=""
                    />
                  </span>
                </div>
                <div
                  class="time-span"
                  style="color: gray; font-size: 15px; margin-left: 7vw"
                >
                  <span>{{ message.time }}</span>
                </div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="点击编辑图表"
                  placement="top"
                >
                  <div
                    @click="handleCanvas(message.text)"
                    class="el-col el-col-22"
                    style="text-align: left; padding-left: 10px"
                  >
                    <!-- 遍历大模型消息框中的图表 -->
                    <!-- <el-checkbox-group> -->
                    <div
                      class="message-item"
                      v-for="(_, index) in message.text"
                      :key="index"
                    >
                      <div
                        style="height: 350px; width: 520px; color: black"
                        :id="'mychart-' + message.optId + index"
                        class="tip right llm-row"
                      >
                        <!-- {{ message.text }} -->
                      </div>
                    </div>
                    <!-- </el-checkbox-group> -->
                  </div>
                </el-tooltip>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <div class="bottom-wrapper">
          <div class="prompt-tag">
            <div
              style="cursor: pointer"
              class="prompt-list"
              v-for="(promptItem, index) in promptList"
              :key="index"
            >
              <el-tooltip content="点击将提示词添加到光标处" placement="top">
                <el-tag size="medium" @click="addPrompt(promptItem)">{{
                  promptItem
                }}</el-tag>
              </el-tooltip>
            </div>
          </div>
          <div class="input_wrapper" v-if="dialogModel == 'excel'">
            <!-- 上传文件按钮 -->
            <div class="upload">
              <!-- <el-button type="primary" @click="uploadFile()">选择文件</el-button>
              <input
                multiple
                type="file"
                style="display: none"
                @change="handleChange"
                accept=".xlsx"
                ref="file"
                @click="
                  (e) => {
                    e.target.value = '';
                  }
                "
              /> -->
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-change="handleFileChanged"
                multiple
                :limit="5"
                :file-list="fileList"
              >
                <el-button slot="trigger" type="primary">点击上传</el-button>
              </el-upload>
            </div>
            <!-- 问题输入框 -->
            <div class="input">
              <el-input
                id="question-input"
                clearable
                placeholder="请输入问题..."
                v-model="text"
                @keyup.enter.native="send"
              >
                <template slot="prepend">
                  <el-tooltip placement="top-start">
                    <div slot="content">
                      问题模板提示-> <br />
                      (1)简单表格：请根据xxx数据，生成关于xx列，背景色为xx(可选)，
                      主题色为xx，图表名称为xxx的xx图。 <br />
                      (2)复杂表格：根据xxx数据，生成x个具有三个图例的柱状图，图例名称分别是xx，并且y轴按照百分比的格式显示，背景色为xx(可选)，
                      主题色为xx，图表名称为xxx的xx图。
                      <br />*注意：问题问法不唯一，请尽量提出详细准确的需求，增加结果的准确性。
                    </div>
                    <i class="el-icon-question" style="font-size: 16px"
                      ><span>帮助</span></i
                    >
                  </el-tooltip>
                </template>
              </el-input>
            </div>

            <!-- 发送按钮 -->
            <div class="button">
              <el-button
                icon="el-icon-s-promotion"
                type="primary"
                @click="send"
              />
            </div>
            <!-- 录音按钮 -->
            <div class="recorder">
              <el-button
                icon="el-icon-mic"
                type="success"
                :loading="isRecording"
                plain
                @click="speechToText"
              />
            </div>
          </div>
          <div class="input_wrapper" v-else>
            <!-- 配置数据源按钮 -->
            <div class="upload">
              <el-button type="primary" @click="setDataSource"
                >配置数据源</el-button
              >
              <!-- <input
                multiple
                type="file"
                style="display: none"
                @change="handleChange"
                accept=".xlsx"
                ref="file"
                @click="
                  e => {
                    e.target.value = '';
                  }
                "
              /> -->
            </div>
            <!-- 问题输入框 -->
            <div class="input">
              <el-input
                id="question-input"
                clearable
                placeholder="请输入问题..."
                v-model="text"
                @keyup.enter.native="send"
              >
                <template slot="prepend">
                  <el-tooltip placement="top-start">
                    <div slot="content">
                      问题模板提示-> <br />
                      (1)简单表格：请根据xxx数据，生成关于xx列，背景色为xx(可选)，
                      主题色为xx，图表名称为xxx的xx图。 <br />
                      (2)复杂表格：根据xxx数据，生成x个具有三个图例的柱状图，图例名称分别是xx，并且y轴按照百分比的格式显示，背景色为xx(可选)，
                      主题色为xx，图表名称为xxx的xx图。
                      <br />*注意：问题问法不唯一，请尽量提出详细准确的需求，增加结果的准确性。
                    </div>
                    <i class="el-icon-question" style="font-size: 16px"
                      ><span>帮助</span></i
                    >
                  </el-tooltip>
                </template></el-input
              >
            </div>
            <!-- 发送按钮 -->
            <div class="button">
              <el-button
                icon="el-icon-s-promotion"
                type="primary"
                @click="send"
              />
            </div>
            <!-- 录音按钮 -->
            <div class="recorder">
              <el-button
                icon="el-icon-mic"
                type="success"
                :loading="isRecording"
                plain
                @click="speechToText"
              />
            </div>
          </div>
        </div>
        <!-- <div class="file-options">
          <div class="file" v-for="(item, index) in fileName" :key="index">
            <span>{{ item }}</span>
          </div>
        </div> -->
      </div>
    </div>
    <!-- 保存记录弹出框 -->
    <el-dialog title="保存对话记录" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="标题名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveHistory">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建对话弹出框 -->
    <el-dialog title="新建对话" :visible.sync="addDialogFormVisible">
      <el-form :model="addform" :rules="rules">
        <el-form-item label="标题名称" prop="title">
          <el-input v-model="addform.title"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addHistory">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 配置数据源 -->
    <el-dialog
      title="配置数据源"
      :visible.sync="dataSourceMsgBoxVisiable"
      :show-close="false"
    >
      <el-form :model="dataSourceForm" :rules="dataSourceFormRules">
        <el-form-item label="数据库驱动" prop="driver">
          <el-input v-model="dataSourceForm.driver"></el-input>
        </el-form-item>
        <el-form-item label="数据库地址" prop="url">
          <el-input v-model="dataSourceForm.url"></el-input>
        </el-form-item>
        <el-form-item label="数据库账号" prop="name">
          <el-input v-model="dataSourceForm.name"></el-input>
        </el-form-item>
        <el-form-item label="数据库密码" prop="password">
          <el-input v-model="dataSourceForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="数据库查询语句" prop="sql">
          <el-card class="sqlcard" shadow="never" style="border: #dddfe6">
            <codemirror
              class="codesql"
              ref="newCm"
              v-model="dataSourceForm.sql"
              :options="cmOptions"
              @ready="onCmReady"
            >
            </codemirror>
          </el-card>
          <!-- <el-input v-model="dataSourceForm.sql"></el-input> -->
        </el-form-item>
      </el-form>
      <el-button effect="plain" @click="testLink" v-if="!isLink">
        <i class="el-icon-key"></i>
        测试连接
      </el-button>
      <el-button type="success" @click="testLink" v-else>
        <i class="el-icon-unlock"></i>
        重新测试
      </el-button>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleDataSourceData">取 消</el-button>
        <el-button type="primary" @click="getDataBaseData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 开发者模式拦截大模型返回消息弹出框 -->
    <el-dialog
      title="查看返回结果"
      :visible.sync="LLMDialogVisiable"
      :show-close="false"
    >
      <el-form :model="LLMResultForm">
        <el-form-item label="输入指令" prop="question">
          <el-input v-model="LLMResultForm.question" readonly></el-input>
        </el-form-item>
        <el-form-item label="返回结果" prop="result">
          <br>
          <span style="color: #a9b7ca">
            <i class="el-icon-warning"></i>
            注意: 代码框中的格式必须为json格式的数据才能渲染成功，可适用于开发人员或调试使用。
          </span>
          <el-card shadow="never" style="border: #dddfe6">
            <codemirror
              class="codesql"
              v-model="LLMResultForm.result"
              :options="LLMOption"
            >
            </codemirror>
          </el-card>
          <!-- <el-input v-model="dataSourceForm.sql"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleRender">取消渲染</el-button>
        <el-button type="primary" @click="confirmRender">确定渲染</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { uuid } from "vue-uuid";
import "codemirror/mode/sql/sql.js";
import "codemirror/lib/codemirror.css";
// 主题css
import "codemirror/theme/solarized.css";
import "codemirror/theme/base16-light.css";
// require active-line.js
import "codemirror/addon/selection/active-line.js";
// closebrackets
import "codemirror/addon/edit/closebrackets.js";

import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/src/line/highlight.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/r/r.js";
import "codemirror/mode/shell/shell.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/swift/swift.js";
import "codemirror/mode/vue/vue.js";

export default {
  name: "Im",
  data() {
    return {
      LLMDialogVisiable: false,
      LLMResultForm: {
        question: "",
        result: "",
        message: [],
      },
      devMode: false,
      finalMessages: [
        {
          role: "system",
          content: "你是一个智能图表引擎助手！",
        },
      ],
      isRepeat: true, //记录上传的文件是否重复
      promptList: ["柱状图", "折线图", "面积图", "点状图"],
      chartInstance: [],
      // 搜索内容
      searchInput: "",
      editor: null,
      // 对话数据源格式
      dialogOptions: [
        {
          label: "Excel数据源",
          value: "excel",
        },
        {
          label: "DataBase数据源",
          value: "database",
        },
      ],
      // 数据库是否连接成功
      isLink: false,
      // 对话模式
      dialogModel: "excel",
      dataSourceMsgBoxVisiable: false,
      checkedOptions: [],
      // 默认选中的项
      selectHistoryId: "",
      fileName: [],
      fileList: [],
      // 用来记录删除的历史记录的id
      deleteHistoryId: -1,
      // 用来记录或者获取大模型返回的每个图表option的id
      optionsId: [],
      modelValue: "gpt-3.5-turbo-0301",
      // 大模型可选版本
      modelOptions: [
        {
          label: "GPT-3.5",
          value: "gpt-3.5-turbo-0301",
        },
        {
          label: "CHATGLM-6",
          value: "chatglm2-6b",
        },
      ],
      circleUrl:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      user: {},
      isCollapse: false,
      chatUser: "",
      text: "",
      messages: [],
      content: "",
      isRecording: false,
      // 记录表格经后端转化后响应的值
      tableMessage: [],
      dataOptions: [],
      form: {
        title: "",
      },
      addform: {
        title: "",
      },
      dataSourceForm: {
        driver: "com.mysql.cj.jdbc.Driver",
        url: "jdbc:mysql://10.20.23.83:3306/bi?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai",
        name: "root",
        password: "r#dcenter9",
        sql: "select * from test0209 limit 0,5",
      },
      dialogFormVisible: false,
      addDialogFormVisible: false,
      rules: {
        title: [
          { required: true, message: "请输入保存记录标题", trigger: "blur" },
          {
            min: 1,
            max: 25,
            message: "长度在 1 到 25 个字符",
            trigger: "blur",
          },
        ],
      },
      dataSourceFormRules: {
        driver: [
          { required: true, message: "请输入数据库驱动", trigger: "blur" },
        ],
        url: [
          { required: true, message: "请输入数据库链接地址", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        sql: [
          { required: true, message: "请输入数据库查询语句", trigger: "blur" },
        ],
      },
      historyList: [
        {
          id: 0,
          title:
            "根据以上表格数据，生成一个柱状图, 根据以上表格数据，生成一个柱状图",
        },
        {
          id: 1,
          title: "根据以上表格数据，生成一个柱状图",
        },
        {
          id: 2,
          title: "根据以上表格数据，生成一个柱状图",
        },
        {
          id: 3,
          title: "根据以上表格数据，生成一个柱状图",
        },
      ],
      // 记录当前历史记录id
      historyId: 0,
      curUUID: 0,
      mychart: null,
      loading: false,
      cmOptions: {
        tabSize: 4, // tabsize默认为4
        // styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: ["text/x-mysql", "text/x-sql"], // 选择代码语言，我这里选的sql
        extraKeys: { Ctrl: "autocomplete" }, //自动提示配置
        lineWrapping: true, // 自动换行
        autoMatchParens: true,
        // theme: "base16-light", // 主题根据需要自行配置
      },
      LLMOption: {
        tabSize: 2, // 缩进格式
        theme: "rubyblue", // 指定主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 是否显示行号
        //指定语言类型,如果需要编辑和显示其他语言,需要import语言js然后修改此配置
        mode: ["javascript", "json", "python"],
        line: true,
        styleActiveLine: true, // 高亮选中行
        //是否为只读,如果为"nocursor" 不仅仅为只读 连光标都无法在区域聚焦
        // readOnly: true,
        hintOptions: {
          completeSingle: true, // 当匹配只有一项的时候是否自动补全
        },
      },
    };
  },
  created() {},
  computed: {},
  mounted() {
    this.getHistoryList();
  },
  methods: {
    // 确认更改并渲染
    confirmRender() {
      this.text = "";

      this.loading = false;
      this.fileName = [];
      // this.tableMessage = [];
      console.log("this.LLMResultForm.result", this.LLMResultForm.result);
      let answerStr = this.cacalAnswer(this.LLMResultForm.result);
      console.log("answerStr", answerStr);
      const answer = JSON.parse(answerStr);

      this.finalMessages.push(this.LLMResultForm.message);
      let options = Array.isArray(answer) ? answer : [answer];
      console.log("初始的options", options);
      //改动title的大小和图例的位置
      options.map((option) => {
        if (option.title) {
          option.title.textStyle = { fontSize: 13 };
          option.title.x = "center";
        }
        if (option.legend) {
          option.legend.bottom = 0;
          option.legend.x = "center";
          option.legend.type = "scroll";
          option.legend.orient = "horizontal";
        }
      });
      console.log("修改后的options", options);
      this.dataOptions = options;
      this.curUUID = uuid.v4();
      this.optionsId.push(this.curUUID);
      this.messages.push({
        optId: this.curUUID,
        user: "gpt",
        text: this.dataOptions,
        time: this.getCurTime(),
      });
      this.scroll2Bottom();
      console.log("所有消息->", this.messages);
      this.$nextTick(() => {
        this.initCharts();
        this.LLMDialogVisiable = false;
      });
    },
    cancleRender() {
      this.LLMDialogVisiable = false;
      this.loading = false;
      this.messages.pop();
      // this.optionsId.pop();
      this.finalMessages.pop();
      this.promptList = ["柱状图", "折线图", "面积图", "点状图"];
    },
    // 根据tag增加提示词
    addPrompt(text) {
      const dom = document.getElementById("question-input");
      console.log(document.getElementById("question-input"));
      const index = dom.selectionStart;
      const content = dom.value;
      this.text =
        content.substring(0, index) +
        text +
        content.substring(index, content.length);
      // 等待dom更新后，重新focus输入框，并将光标定位
      this.$nextTick(() => {
        dom.focus();
        dom.setSelectionRange(index, index + text.length);
      });
    },
    // 复制指令到剪切板（通过创建input框，获取数据到剪切板，再删除输入框元素的方法）
    handleCopyMessage(text) {
      let input = document.createElement("input");
      input.setAttribute("id", "input_for_copyText");
      input.value = text;
      document.getElementsByTagName("body")[0].appendChild(input);
      document.getElementById("input_for_copyText").select();
      document.execCommand("copy");
      document.getElementById("input_for_copyText").remove();
    },
    // 编辑赋值已发送指令按钮
    handleEditMessage(text) {
      console.log("text", text);
      // 给输入框赋值
      this.text = text;
    },
    // 当改变到“”时，触发搜索
    handleSearchChange() {
      this.handleSearch();
    },
    // 清空搜索框时触发
    handleClear() {
      this.getHistoryList();
    },
    // 搜索时触发
    handleSearch() {
      if (this.searchInput == "") {
        this.getHistoryList();
      } else {
        const pattern = new RegExp(this.searchInput, "i"); // 不区分大小写
        this.historyList = this.historyList.filter((item) => {
          return pattern.test(item.note);
        });
      }
    },
    // 模式切换为数据库源时执行
    handleSelectModeChange() {
      this.fileName = [];
    },
    cancleDataSourceData() {
      this.dataSourceMsgBoxVisiable = false;
      this.isLink = false;
    },
    setDataSource() {
      this.dataSourceMsgBoxVisiable = true;
    },
    // 初始化数据库语句输入区域
    onCmReady(cm) {
      // 设置代码编辑框宽和高
      this.$refs.newCm.codemirror.setSize("-webkit-fill-available", "auto");
    },
    // 测试是否连接成功
    testLink() {
      this.isLink = false;
      this.$axios({
        method: "post",
        url: "http://10.20.147.157:41119/mvc/getTableData",
        // url: "http://10.188.125.210:41101/mvc/getTableData",
        data: {
          dbConfig: {
            driver: this.dataSourceForm.driver,
            url: this.dataSourceForm.url,
            name: this.dataSourceForm.name,
            password: this.dataSourceForm.password,
            sql: this.dataSourceForm.sql,
          },
          dataType: "database",
          excelData: "",
        },
      }).then((res) => {
        if (res.data.success) {
          this.isLink = true;
          this.$message({
            type: "success",
            message: "数据源连接成功!",
          });
        } else {
          this.$message({
            type: "warning",
            message: "数据源连接不成功,请检查后重新连接",
          });
        }
      });
    },
    // 从数据库中查询数据
    getDataBaseData() {
      // this.isLink = false;
      this.$axios({
        method: "post",
        url: "http://10.20.147.157:41119/mvc/getTableData",
        // url: "http://10.188.125.210:41101/mvc/getTableData",
        data: {
          dbConfig: {
            driver: this.dataSourceForm.driver,
            url: this.dataSourceForm.url,
            name: this.dataSourceForm.name,
            password: this.dataSourceForm.password,
            sql: this.dataSourceForm.sql,
          },
          dataType: "database",
          excelData: "",
        },
      }).then((res) => {
        this.isLink = false;
        this.dataSourceMsgBoxVisiable = false;
        this.tableMessage.push(res.data.dataResult);
        console.log("getTableData-database", res);
      });
    },
    // 多选跳转编辑界面
    handleMutiEdit() {
      if (this.checkedOptions.length == 0) {
        this.$message({
          message: "请先进行多选选择！",
          type: "warning",
        });
      } else {
        this.$store.state.options = JSON.parse(
          JSON.stringify(this.checkedOptions.flat(1))
        );
        // this.$bus.$emit("getOption", this.dataOptions);
        this.$router.push({ path: "editGrid" });
        console.log("state.options", this.$store.state.options);
      }
    },
    // 多选框change事件
    handleCheckChange(value) {
      console.log("value", value);
    },
    scroll2Bottom() {
      this.$nextTick(() => {
        const scrollArea = document.getElementById("message-scroll-area");
        console.log("scrollArea.scrollTop", scrollArea.scrollTop);
        console.log("scrollArea.scrollHeight", scrollArea.scrollHeight);
        // scrollArea.scrollTop = 5000000000;
        scrollArea.scrollTo({ top: scrollArea.scrollHeight + 3000 });
      });
    },
    hisScroll2Bottom() {
      this.$nextTick(() => {
        const HisScrollArea = document.getElementById("his-list");
        console.log("scrollArea.scrollTop", HisScrollArea.scrollTop);
        console.log("scrollArea.scrollHeight", HisScrollArea.scrollHeight);
        // scrollArea.scrollTop = 5000000000;
        HisScrollArea.scrollTo({ top: HisScrollArea.scrollHeight + 3000 });
      });
    },
    // 点击历史记录列表项，展示对话内容
    handleClick(historyId) {
      // this.scroll2Bottom();
      //清空之前的所有echarts实例
      this.handleRemove(null, []);
      this.fileName = [];
      this.text = "";
      this.finalMessages = [
        {
          role: "system",
          content: "你是一个智能图表引擎助手！",
        },
      ];
      this.chartInstance.forEach((chartItem) => {
        chartItem.dispose();
        chartItem = null;
      });

      this.checkedOptions = [];
      this.historyId = historyId;
      this.$axios({
        method: "post",
        url: "http://10.20.147.157:41119/mvc/getHistoryDetail",
        data: {
          id: historyId,
        },
      }).then((res) => {
        if (res.data.success) {
          // 构造finalMessages,即获取当前对话的所有内容
          res.data.dataResult.data.forEach((item) => {
            let msg = {};
            msg.role = item.user == "user" ? "user" : "assistant";
            msg.content = JSON.stringify(item.text);
            this.finalMessages.push(msg);
          });
          console.log("获取当前对话的所有内容", this.finalMessages);

          this.messages = res.data.dataResult.data;
          this.form.title = res.data.dataResult.note;
          console.log("res", res);
          this.$nextTick(() => {
            this.messages.forEach((item, _) => {
              if (item.user == "gpt") {
                item.text.forEach((option, index) => {
                  this.mychart = this.$echarts.init(
                    document.getElementById("mychart-" + item.optId + index)
                  );
                  this.mychart.setOption(option);
                  this.chartInstance.push(this.mychart);
                });
              }
              this.scroll2Bottom();
            });
          });
        }
      });
    },
    // 跳转到编辑图表页面
    handleCanvas(option) {
      this.$store.state.options = JSON.parse(JSON.stringify(option));
      // this.$bus.$emit("getOption", this.dataOptions);
      this.$router.push({ path: "editGrid" });
      console.log("state", this.$store.state);
    },
    // 发送消息框
    send() {
      console.log("aaa");
      console.log("时间", this.getCurTime());
      this.scroll2Bottom();
      console.log("this.messages.length", this.messages.length);
      if (this.messages.length > 10) {
        this.$message({
          message: "当前对话已超过最大token,请新建对话！",
          type: "warning",
        });
        return;
      }
      if (this.text != "") {
        this.getPrompt();
        setTimeout(() => {
          // 发送消息给大模型，得到结果
          // this.scroll2Bottom();
          this.loading = true;

          this.messages.push({
            user: "user",
            text: this.text,
            time: this.getCurTime(),
          });
          this.scroll2Bottom();
          this.tableMessage = this.tableMessage.flat(Infinity);
          console.log("this.tableMessage", this.tableMessage);
          if (this.tableMessage.length != 0) {
            this.finalMessages.push(
              {
                role: "user",
                content: JSON.stringify(this.tableMessage),
              },
              {
                role: "user",
                content: this.text + 
                "返回option对象数组并转化为json格式,不要加代码语言注释,添加图表下载按钮",
              }
            );
          } else {
            // 当没有上传表格文件时
            this.finalMessages.push({
              role: "user",
              content: this.text +
              "返回option对象数组并转化为json格式,不要加代码语言注释,添加图表下载按钮",
            });
          }
          this.$axios({
            method: "post",
            // url: "http://10.20.35.114:3717/v1/chat/completions",
            url: "http://10.20.147.157:41119/mvc/generateData",
            // url: "http://10.188.125.210:41101/mvc/generateData",

            data: {
              method: "post",
              url: "http://10.20.35.114:3717/v1/chat/completions",
              headers: {
                "User-Agent": "Apifox/1.0.0 (https://www.apifox.cn)",
                "x-api-key": "51Pbnk1MhU2biX9NmH9GuYsXaaO9mQWC8F7EZGORwCyxLXdA",
                "Content-Type": "application/json;charset=utf-8",
                Accept: "application/json",
              },
              data: {
                model: this.modelValue,
                messages: this.finalMessages,
                n: 1,
                max_tokens: 3000,
                temperature: 0.98,
                top_p: 1,
                stream: "False",
              },
            },
          }).then((res) => {
            console.log(
              "生成图表内容",
              res.data.dataResult.choices[0].message.content
            );
            this.LLMResultForm.question = this.text;
            this.LLMResultForm.result =
              res.data.dataResult.choices[0].message.content;
            this.LLMResultForm.message = res.data.dataResult.choices[0].message;
            if (res.data.success) {
              if (this.devMode) {
                this.LLMDialogVisiable = true;
              } else {
                try {
                  console.log("generateData", res);
                  this.text = "";

                  this.loading = false;
                  this.fileName = [];
                  // this.tableMessage = [];
                  let answerStr = this.cacalAnswer(
                    res.data.dataResult.choices[0].message.content
                  );
                  console.log("answerStr", answerStr);
                  const answer = JSON.parse(answerStr);

                  this.finalMessages.push(
                    res.data.dataResult.choices[0].message
                  );
                  let options = Array.isArray(answer) ? answer : [answer];
                  console.log("初始的options", options);
                  //改动title的大小和图例的位置
                  options.map((option) => {
                    if (option.title) {
                      option.title.textStyle = { fontSize: 13 };
                      option.title.x = "center";
                    }
                    if (option.legend) {
                      option.legend.bottom = 0;
                      option.legend.x = "center";
                      option.legend.type = "scroll";
                      option.legend.orient = "horizontal";
                    }
                  });
                  console.log("修改后的options", options);
                  this.dataOptions = options;
                  this.curUUID = uuid.v4();
                  this.optionsId.push(this.curUUID);
                  this.messages.push({
                    optId: this.curUUID,
                    user: "gpt",
                    text: this.dataOptions,
                    time: this.getCurTime(),
                  });
                  this.saveHistory();
                  this.scroll2Bottom();
                  console.log("所有消息->", this.messages);
                  this.$nextTick(() => {
                    this.initCharts();
                  });
                } catch (err) {
                  this.messages.pop();
                  this.optionsId.pop();
                  this.finalMessages.pop();
                  this.promptList = ["柱状图", "折线图", "面积图", "点状图"];
                  this.$message({
                    message:
                      "您输入的问题大模型可能没理解，请重新组织语言输入吧！",
                    type: "warning",
                  });
                }
              }
            }
          });
        });
      } else {
        this.loading = false;
        this.$message({
          message: "请选择数据并且输入指令后再发送哦",
          type: "error",
        });
      }
    },
    cacalAnswer(str) {
      let index1 = str.indexOf("[");
      let index2 = str.indexOf("{");
      let endIndex;
      // 如果是正确的option，直接返回
      if (index1 == 0 || index2 == 0) return str;
      //  如果方括号在最外面
      if (index1 < index2) {
        for (let i = str.length; i >= 0; i--) {
          if (str[i] == "]") {
            endIndex = i;
            break;
          }
        }
        return str.substring(index1, endIndex + 1);
      } else {
        for (let i = str.length; i >= 0; i--) {
          if (str[i] == "}") {
            endIndex = i;
            break;
          }
        }
        return str.substring(index2, endIndex + 1);
      }
    },
    getCurTime() {
      let obj = new Date();
      //获取年月日，时分秒
      let a = obj.getFullYear();
      let b =
        obj.getMonth() + 1 <= 9
          ? "0" + (obj.getMonth() + 1)
          : obj.getMonth() + 1; //月份从0月开始，所以需要+1
      let c = obj.getDate() <= "9" ? "0" + obj.getDate() : obj.getDate();
      let d = obj.getHours() <= "9" ? "0" + obj.getHours() : obj.getHours();
      let e =
        obj.getMinutes() <= "9" ? "0" + obj.getMinutes() : obj.getMinutes();
      let f = obj.getSeconds();
      return `${b}/${c} ${d}:${e}`;
    },
    getPrompt() {
      this.$axios({
        method: "post",
        // url: "http://10.20.35.114:3717/v1/chat/completions",
        url: "http://10.20.147.157:41119/mvc/generateData",
        // url: "http://10.188.125.210:41101/mvc/generateData",

        data: {
          method: "post",
          url: "http://10.20.35.114:3717/v1/chat/completions",
          headers: {
            "User-Agent": "Apifox/1.0.0 (https://www.apifox.cn)",
            "x-api-key": "51Pbnk1MhU2biX9NmH9GuYsXaaO9mQWC8F7EZGORwCyxLXdA",
            "Content-Type": "application/json;charset=utf-8",
            Accept: "application/json",
          },
          data: {
            model: "gpt-3.5-turbo-0301",
            messages: [
              {
                role: "user",
                content:
                  "请将“" +
                  this.text +
                  "”这句话中的关键词提取出来，并以中文标点符号顿号作为间隔",
              },
            ],
            n: 1,
            max_tokens: 3000,
            temperature: 0.98,
            top_p: 1,
            stream: "False",
          },
        },
      }).then((res) => {
        console.log(
          "获取提示词",
          res.data.dataResult.choices[0].message.content
        );
        if (res.data.success) {
          this.promptList = [];
          let str = res.data.dataResult.choices[0].message.content;
          if (str.indexOf("。") != -1) {
            str = str.substring(0, str.length - 1);
          }
          const resArr = str.split(/[,、，]/);
          if (resArr.length <= 5) {
            resArr.forEach((item) => {
              this.promptList.push(item);
            });
          } else {
            for (let i = 0; i <= 5; i++) {
              this.promptList.push(resArr[i]);
            }
          }
        }
      });
    },
    // 控制保存记录弹出框
    handleOpenDialog() {
      this.dialogFormVisible = true;
    },
    // 确认是否清空当前对话
    handleClearHistory() {
      this.$confirm("确认清空对话？").then((_) => {
        this.messages = [];
        this.finalMessages = [
          {
            role: "system",
            content: "你是一个智能图表引擎助手！",
          },
        ];
        const id = this.historyId;
        // 发送post删除对话记录
        this.$axios({
          method: "post",
          url: "http://10.20.147.157:41119/mvc/putHistory",
          data: {
            id: id,
            note: this.form.title,
            data: [],
          },
        }).then((res) => {
          if (res.data.success) {
            this.messages = [];
            this.finalMessages = [
              {
                role: "system",
                content: "你是一个智能图表引擎助手！",
              },
            ];
            this.$message({
              type: "success",
              message: "当前对话已清空！",
            });
          }
        });
      });
    },
    // 初始化echarts图表
    initCharts() {
      try {
        console.log(
          "this.dataOptions, this.optionsId",
          this.dataOptions,
          this.optionsId
        );
        this.dataOptions.forEach((item, index) => {
          this.mychart = this.$echarts.init(
            document.getElementById("mychart-" + this.curUUID + index)
          );
          console.log(
            "当前渲染的dom节点, message：",
            this.mychart,
            this.messages
          );
          //清空画布
          // chart.clear();
          this.mychart.showLoading({
            text: "loading",
            color: "#c23531",
            textColor: "#000",
            maskColor: "rgba(255, 255, 255, 0.2)",
            zlevel: 0,
          });
          //图表显示提示信息
          //setOption前隐藏loading事件
          this.mychart.hideLoading();
          this.mychart.setOption(item);
        });
      } catch (err) {
        this.messages.pop();
        this.optionsId.pop();
        this.$message({
          message: "emmm...大模型出现问题了，请您再次发送消息提问吧",
          type: "error",
        });
      }
    },
    // 语音识别成文本
    speechToText() {
      this.isRecording = !this.isRecording;
      this.recognition = new webkitSpeechRecognition();
      // 设置识别参数
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      // 设置语言
      this.recognition.lang = "zh-CN";

      // 监听识别结果事件
      this.recognition.onresult = (e) => {
        // 处理识别结果
        this.text = e.results[0][0].transcript;
        console.log(e.results[0][0].transcript);
        this.recognition.stop(); // 停止识别
        this.isRecording = false;
      };

      // 监听识别错误事件
      this.recognition.onerror = (e) => {
        // 处理识别错误
        console.log("Error: " + e.error);
        this.recognition.stop(); // 停止识别
        this.isSpeaking = false;
      };

      this.recognition.start();
    },
    // uploadFile() {
    //   this.$refs.file.dispatchEvent(new MouseEvent("click"));
    // },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`);
    },
    handleRemove(file, fileList) {
      console.log("执行删除文件", file, fileList);
      this.tableMessage = [];
      this.fileList = fileList;
    },
    handleFileChanged(file, fileList) {
      if (
        fileList.findIndex((f) => f.name === file.name) !=
        fileList.findLastIndex((f) => f.name === file.name)
      ) {
        this.$message({
          message: `${file.name}文件已存在！`,
          type: "warning",
        });
        fileList.pop();
      }
      console.log("改变", fileList);
      for (let i = 0; i < fileList.length; i++) {
        this.getBase64(fileList[i].raw).then((res) => {
          this.excel2Base64 = res.split(",")[1];
          console.log("this.excel2Base64", this.excel2Base64);
          this.getTableData(this.excel2Base64);
        });
      }
    },
    // handleChange(e) {
    //   // const reader = new FileReader();
    //   if (e.target.files) {
    //     for (let i = 0; i < e.target.files.length; i++) {
    //       this.fileName.push(e.target.files[i].name);
    //       this.getBase64(e.target.files[i]).then(res => {
    //         this.excel2Base64 = res.split(",")[1];
    //         console.log("this.excel2Base64", this.excel2Base64);
    //         this.getTableData(this.excel2Base64);
    //       });
    //     }
    //   }
    // },
    // 文件转化为base64格式
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        let result = "";
        console.log("file", file);
        reader.readAsDataURL(file);
        reader.onload = function () {
          result = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(result);
        };
      });
    },
    // 新建对话
    addHistory() {
      // 将当前的时间戳数字转化为小时时间戳，作为id
      const id = parseInt(new Date().getTime() / 3600);
      // 发送post保存历史记录
      this.$axios({
        method: "post",
        url: "http://10.20.147.157:41119/mvc/putHistory",
        data: {
          id: id,
          note: this.addform.title,
          data: [],
        },
      }).then((res) => {
        if (res.data.success) {
          this.addDialogFormVisible = false;
          this.$axios({
            method: "post",
            url: "http://10.20.147.157:41119/mvc/getHistoryList",
            data: {
              pageNo: 1,
              pageSize: 1000,
            },
          }).then((res) => {
            if (res.data.success) {
              this.historyList = res.data.dataResult;
              this.hisScroll2Bottom();
              this.selectHistoryId = id.toString();
              this.addform.title = "";
              this.handleClick(this.selectHistoryId);
              this.$message({
                type: "success",
                message: "新建对话成功！",
              });
            }
          });
        }
      });
      // this.hisScroll2Bottom();
    },
    // 向数据库发送请求，保存当前this.messages中的所有数据
    saveHistory() {
      console.log("当前对话记录：");
      console.log(this.form);
      console.log(this.messages);
      // 将当前的时间戳数字转化为小时时间戳，作为id
      if (this.form.title == "") {
        this.$message({
          type: "warning",
          message: "还未确认对话名称哦！",
        });
      } else {
        // 通过historyId判断是否是已有历史记录修改后的保存
        const id =
          this.historyId === 0
            ? parseInt(new Date().getTime() / 3600)
            : this.historyId;
        // 发送post保存历史记录
        this.$axios({
          method: "post",
          url: "http://10.20.147.157:41119/mvc/putHistory",
          data: {
            id: id,
            note: this.form.title,
            data: this.messages,
          },
        }).then((res) => {
          if (res.data.success) {
            this.dialogFormVisible = false;
            // this.messages = [];
            // 获取新的历史记录列表
            this.$axios({
              method: "post",
              url: "http://10.20.147.157:41119/mvc/getHistoryList",
              data: {
                pageNo: 1,
                pageSize: 1000,
              },
            }).then((res) => {
              if (res.data.success) {
                this.historyList = res.data.dataResult;
                this.hisScroll2Bottom();
              }
              console.log("获取到历史记录数据", res);
            });
            this.$message({
              type: "success",
              message: "保存对话记录成功！",
            });
          }
        });
      }

      //保存成功，更新左侧历史记录列表
    },
    // 从后端获取表格数据，作为大模型入参
    getTableData(data) {
      this.$axios({
        method: "post",
        url: "http://10.20.147.157:41119/mvc/getTableData",
        // url: "http://10.188.125.210:41101/mvc/getTableData",
        data: {
          dbConfig: {
            driver: "com.mysql.cj.jdbc.Driver",
            url: "jdbc:mysql://10.20.147.157:3306/hr_bi",
            name: "root",
            password: "r#dcenter9",
            sql: "select * from hr_bi_template_list",
          },
          dataType: "excel",
          excelData: data,
        },
      }).then((res) => {
        this.tableMessage.push(res.data.dataResult);
        console.log("getTableData", res);
      });
    },
    // 根据id删除特定历史记录
    handleClose(id) {
      this.$confirm("确认删除此历史记录？").then((_) => {
        // 对数据库发送删除请求
        this.$axios({
          method: "post",
          url: "http://10.20.147.157:41119/mvc/deleteHistory",
          data: {
            id: id,
          },
        }).then((res) => {
          if (res.data.success == true) {
            this.getHistoryList();
            this.messages = [];
            this.handleRemove(null, []);
            this.$message({
              message: "删除成功！",
              type: "success",
            });
          }
        });
      });
      // this.selectHistoryId = this.historyList[0].id.toString();
      // console.log("this.selectHistoryId", this.selectHistoryId);
      // this.handleClick(this.selectHistoryId);
    },
    getHistoryList() {
      this.$axios({
        method: "post",
        url: "http://10.20.147.157:41119/mvc/getHistoryList",
        data: {
          pageNo: 1,
          pageSize: 1000,
        },
      }).then((res) => {
        if (res.data.success) {
          this.historyList = res.data.dataResult;
        }
        console.log("获取到历史记录数据", res);
      });
    },
    handleAddHistory() {
      this.addDialogFormVisible = true;
    },
  },
};
</script>
<style>
.history-add {
  width: 95%;
  margin: 10px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #e6a23c;
  font-weight: 500;
  background-color: #fdf6ec;
  box-shadow: 0 0 2px rgb(227, 222, 214);
}
.el-message-box__wrapper {
  margin-bottom: 500px;
}
.lay-wrapper {
  display: flex;
  width: 100%;
  height: 96vh;
}
.history {
  width: 330px;
  height: 100%;
}
.chat {
  flex: 1;
  height: 100%;
}
.tip {
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  width: auto;
  display: inline-block !important;
  display: inline;
}
.right {
  background-color: #ffffff;
}
.left {
  background-color: #95ec69;
}
.input_wrapper {
  display: flex;
  height: 50px;
  justify-content: center;
  align-items: baseline;
  /* margin-bottom: 20px; */
}
.input {
  margin-left: 5px;
  flex: 10;
  /* margin: 30px; */
}
.button {
  /* margin-left: 10px; */
  margin-left: 20px;
  margin-right: -40px;
  flex: 0.9;
}
.recorder {
  margin: 10px;
  margin-right: -10px;
  flex: 1;
}
.upload {
  flex: 1;
  margin-left: 30px;
}

.file-options {
  margin-left: 30px;
  height: 60px;
  display: flex;
}
.file {
  color: #333;
  padding-right: 15px;
}
.out-wrapper {
  width: 99%;
  height: 100%;
  margin-left: 15px;
  /* margin: 0 auto; */
  background-color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 0 10px #ccc;
  background-image: url("../../assets/background.svg");
  background-position: inherit;
}
.canvas-bg {
  width: 80px;
  height: 30px;
  padding-top: 20px;
  padding-right: 10px;
}
.upload-wrapper {
  position: relative;
  bottom: 10px;
  margin-left: 20px;
  margin-bottom: 20px;
}
.el-col-22:hover {
  cursor: pointer;
  border: 1px #0088fe dashed;
}
.el-col-22 {
  display: flex;
  flex-wrap: wrap;
}

.message-checkbox {
  /* margin-right: -100px; */
  position: relative;
  bottom: 15px;
}
.message-item {
  margin: 3px;
}
.save-button {
  /* float: right; */
  margin-left: -100px;
  /* justify-content: flex-end; */
  position: relative;
  left: 130px;
}
/* .select-model {
  position: relative;
  right: 150px;
  width: 150px;
  margin-left: 20px;
} */
.history-title {
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.history-card {
  width: 100%;
  height: 100%;
  min-height: 700px;
  color: #333;
  background-color: #f5f5f5;
  box-shadow: 0 0 10px rgb(210, 206, 198);
  /* overflow-y: scroll; */
  overflow-y: auto;
  overflow-x: hidden;
}
.lay-wrapper {
  background-image: url("../../assets/background.svg");
  background-position: inherit;
}
.normal-tag {
  /* margin: 10px; */
  /* transition-delay: 9999s; */
  display: flex;
  /* justify-content: center; */
  align-items: center;
  /* justify-content: center; */
  width: 100%;
  height: 40px;
  margin-top: 5px;
  background-color: #e4e4fe;
  color: #6161f4;
  /* border-radius: 5px; */
}
/* .history-list-tag:active {
  
} */
.normal-tag:checked {
  margin-top: 5px;
  cursor: pointer;
  background-color: #f4f4f5;
  color: #909399;
  border: 1px dashed #909399;
  border-radius: 5px;
}
.history-title-span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 5px;
  padding-right: 5px;
  width: 220px;
  display: flex;
  flex-direction: column;
}
/* el-tag:focus {
  cursor: pointer;
  background-color: #f4f4f5;
  color: #909399;
  border: 1px dashed #909399;
} */
.history-list-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.history-menu {
  background-color: #f5f5f5;
}

.codesql {
  border: 1px solid #000;
  font-size: 11pt;
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
}
.sqlcard {
  margin-top: 40px;
}

.iconfont {
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-lishijilu1:before {
  content: "\e763";
}

.titleFont {
  font-weight: 600;
  font-size: 20px;
  border-radius: 2px;
  margin-right: 70px;
}

.timeSpan {
  font-size: 13px;
  line-height: 20px;
  color: grey;
}
.noteSpan {
  line-height: 20px;
  font-weight: 550;
}

.serachHistory {
  margin: 10px;
  width: 95%;
}

.message-extend:hover {
  cursor: pointer;
  color: #0088fe;
}
.el-col-21 {
  width: 94%;
}
.el-col-2 {
  width: 6%;
}
.prompt-tag {
  display: flex;
  margin-left: 150px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.prompt-list {
  margin-left: 20px;
}

body {
  overflow-x: hidden;
}
.el-upload-list {
  display: flex;
  position: absolute;
  left: 400px;
  bottom: 35px;
  height: 40px;
  overflow-x: auto;
}
.el-upload-list__item:first-child {
  margin-top: 5px !important;
}
</style>
