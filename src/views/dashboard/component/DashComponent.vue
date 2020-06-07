<template>
  <div class="body">
    <div id="answerDetail">
      <div class="body-container">
        <div
          v-for="(data,dataIndex) in dataList"
          :key="dataIndex"
          class="body-bottom"
        >
          <el-row type="flex" justify="center">
            <el-tag type="success" effect="dark">{{ data.answerObj.question.name }}</el-tag>
            <el-button v-if="dataIndex===0" type="warning" round class="export-btn" size="small" @click.stop="exportPdf">导出</el-button>
          </el-row>
          <el-divider />
          <el-row type="flex" justify="space-around">
            <el-tag type="success">问卷类型：{{ data.answerObj.questionType.chinese }}</el-tag>
            <el-tag type="success">姓名：{{ data.answerObj.person.name }}</el-tag>
            <el-tag type="info">身份：{{ data.answerObj.person.role.chinese }}</el-tag>
            <el-tag type="warning">填写时间：{{ data.answerObj.createTime }}</el-tag>
          </el-row>
          <el-divider />
          <el-card v-for="(title,index) in data.detailList" :key="index" class="box-card mb-15">
            <div slot="header" class="clearfix">
              <span>{{ title.order+'.'+title.title }}</span>
            </div>
            <div v-for="(op,i) in title.option" :key="i" class="text item">
              <span v-if="title.topic==='input'">{{ title.content }}</span>
              <span v-else>{{ op.name+"."+op.content }}</span>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashComponent',
  props: {
    personName: {
      type: String,
      required: true
    },
    personId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dataList: [],
      isPdf: true
    }
  },
  created() {
    this.getAnswerDetail()
  },
  methods: {
    async getAnswerDetail() {
      const loading = this.localLoading()
      try {
        const res = await this.$api.question.getMergeDetail({
          personId: this.personId
        })
        loading.close()
        if (res.result) {
          // console.log(res.data)
          this.dataList = res.data
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        loading.close()
      }
    },
    exportPdf() {
      this.$getPdf('answerDetail', this.personName + '的调查问卷')
      // this.getAnswerDetail()
    },
    localLoading() {
      const loading = this.$loading({ lock: true })
      return loading
    }
  }
}
</script>

<style scoped lang="scss">
  .body{
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    background-color: #fff;
  }
  #answerDetail{
    padding: 20px;
  }
  .body-container{
    margin: 20px;
  }
  .body-bottom{
    margin-bottom: 50px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  /deep/.el-card__body {
    padding-bottom: 0px;
  }
  .export-btn{
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
