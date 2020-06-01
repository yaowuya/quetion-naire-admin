<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <el-row type="flex" justify="space-between">
          <el-col :span="20">
            <span class="header-span">{{ titleData.order }}.{{ titleData.name }}</span>
          </el-col>
          <el-col :span="4">
            <el-button type="success" class="f-right" size="small" @click.stop="addOptionByTitle">确认提交</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-for="(op,key) in titleData.option" :key="key">
        <el-row v-if="topicId!='input'" type="flex" justify="space-between">
          <el-col :span="20">
            <el-input v-model="op.content" placeholder="请输入内容" class="mb-10">
              <el-select slot="prepend" v-model="op.name" placeholder="选项">
                <el-option
                  v-for="(alphabet,index) in alphabetList"
                  :key="index"
                  :label="alphabet"
                  :value="alphabet"
                />
              </el-select>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button icon="el-icon-plus" circle @click="addOption(op,key)" />
            <el-button icon="el-icon-minus" circle @click="minuOption(op,key)" />
          </el-col>
        </el-row>
        <el-row v-if="topicId==='input'" type="flex" justify="space-between">
          <el-col :span="20">
            <el-input v-model="op.content" type="textarea" />
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>

import { alphabet } from '@/utils'

export default {
  name: 'OptionComponent',
  props: {
    titleId: {
      type: String,
      required: true
    },
    topicId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      alphabetList: alphabet(),
      titleData: {}
    }
  },
  created() {
    this.getTitleAndOption()
  },
  methods: {
    async getTitleAndOption() {
      const res = await this.$api.question.getTitleAndOption({ titleId: this.titleId })
      if (res.result) {
        // console.log(res.data)
        this.titleData = res.data[0]
        if (this.titleData.option.length === 0) {
          this.titleData.option.push({
            name: this.alphabetList[0],
            content: '',
            title: this.titleData._id
          })
        }
      } else {
        this.$message.error(res.message)
      }
    },
    addOption(op, index) {
      this.titleData.option.splice(index + 1, 0,
        {
          name: this.alphabetList[this.alphabetList.indexOf(op.name) + 1],
          content: '',
          title: this.titleData._id
        })
    },
    minuOption(op, index) {
      if (this.titleData.option.length === 1) {
        return
      }
      this.titleData.option.splice(index, 1)
    },
    async addOptionByTitle() {
      if (!this.validateSubmit()) {
        return
      }
      const loading = this.localLoading()
      try {
        const res = await this.$api.question.addOptionByTitle({
          option: this.titleData.option,
          titleId: this.titleId
        })
        if (res.result) {
          this.$message.success('提交成功')
          this.$emit('close-option')
        } else {
          this.$message.error(res.message)
        }
        loading.close()
      } catch (e) {
        loading.close()
      }
    },
    localLoading() {
      const loading = this.$loading({ lock: true })
      return loading
    },
    validateSubmit() {
      let validate = false
      if (this.titleData.option.length === 0) {
        this.$message.error('值不能为空')
        return false
      }
      this.titleData.option.forEach(item => {
        if (this.topic !== 'input') {
          if (item.name === '' || item.name === undefined) {
            validate = true
            return
          }
        }
        if (item.content === '' || item.content === undefined) {
          validate = true
          return
        }
      })
      if (validate) {
        this.$message.error('值不能为空')
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .header-span {
    font-size: 18px;
    font-weight: bold;
    line-height: 30px;
  }

  /deep/ .el-select .el-input {
    width: 80px;
  }
</style>
