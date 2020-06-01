<template>
  <div class="app-container body">
    <el-row type="flex" justify="center" class="mb-20">
      <el-tag type="success" effect="dark">{{ questionName }}</el-tag>
    </el-row>
    <el-card v-for="(title,index) in titleList" :key="index" class="box-card mb-15">
      <div slot="header" class="clearfix">
        <span>{{ title.order+'.'+title.title }}</span>
      </div>
      <div v-for="(op,i) in title.option" :key="i" class="text item">
        <span v-if="title.topic==='input'">{{ title.content }}</span>
        <span v-else>{{ op.name+"."+op.content }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AnswerComponent',
  props: {
    personId: {
      type: String,
      required: true
    },
    questionId: {
      type: String,
      required: true
    },
    questionTypeId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      questionName: '',
      titleList: []
    }
  },
  created() {
    this.getAnswerDetail()
  },
  methods: {
    async getAnswerDetail() {
      const res = await this.$api.question.getAnswerDetail({
        questionId: this.questionId,
        personId: this.personId,
        questionTypeId: this.questionTypeId
      })
      if (res.result) {
        console.log(res.data)
        this.titleList = res.data
        this.questionName = res.questionName
      } else {
        this.$message.error(res.message)
      }
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
</style>
