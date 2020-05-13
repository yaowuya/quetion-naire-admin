<template>
  <section class="dashboard">
    <el-row class="mt-10 px-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="广告名称">
          <el-input v-model="formInline.name" placeholder="广告名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryAd">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="addAd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <Table
      :table-data="tableData"
      :columns="columns"
      :page-num="pageNum"
      :page-size="pageSize"
      :total="total"
      @search="search"
    >
      <el-table-column
        slot="picture"
        prop="icon"
        label="广告图"
        width="300"
      >
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="height:100px;">
        </template>
      </el-table-column>
      <el-table-column
        slot="operate"
        fixed="right"
        label="操作"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </Table>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      width="50%"
      center
    >
      <el-form ref="ruleForm" :model="dialogForm" label-position="left" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="广告图">
          <el-input v-model="dialogForm.icon" readonly />
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="getAuthHeaders()"
            :show-file-list="false"
            :on-success="afterUpload"
          >
            <img v-if="dialogForm.icon" :src="dialogForm.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="外链URL" prop="url">
          <el-input v-model="dialogForm.url" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import Table from '../../components/Table'

export default {
  name: 'Dashboard',
  components: {
    Table
  },
  data() {
    return {
      tableData: [],
      columns: [],
      formInline: {
        name: ''
      },
      ads: [],
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogStatus: 'create',
      dialogVisible: false,
      dialogForm: {
        name: '',
        icon: '',
        url: ''
      },
      dialogId: null,
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.initCol()
    this.onSearch()
  },
  methods: {
    initCol() {
      this.columns = [
        // { slot: 'selection' },
        { label: '名称', prop: 'name', width: '120' },
        // { label: '广告图片', prop: 'icon', width: '220' },
        { slot: 'picture' },
        { label: '外链URL', prop: 'url', width: '400' },
        { slot: 'operate' }
      ]
    },
    search(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.onSearch()
    },
    async onSearch() {
      const res = await this.$http.post('/page/photo/photo/pageList', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.formInline.name,
        sort: { 'order': 1 }
      })
      this.tableData = res.data
      this.total = res.count
      // console.log('onSearch', res)
    },
    afterUpload(res) {
      // this.$set(this.dialogForm.url, 'icon', res.url)
      this.dialogForm.icon = res.url
    },
    addAd() {
      this.dialogVisible = true
      this.dialogStatus = 'create'
      this.dialogId = null
      // 删除_id,防止创建时传入重复_id
      delete this.dialogForm._id
      this.empty('ruleForm')
      this.dialogForm.icon = ''
    },
    queryAd() {
      this.pageNum = 1
      this.onSearch()
    },
    handleEdit(index, row) {
      this.dialogVisible = true
      this.dialogStatus = 'update'
      this.dialogId = row._id
      this.empty()
      this.$nextTick(() => {
        this.dialogForm = Object.assign({}, row)
        this.empty('ruleForm')
      })
    },
    handleDelete(index, row) {
      this.$confirm(`是否确定要删除广告 "${row.name}"`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$http.delete(`/rest/photo/${row._id}`)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const filenameArray = row.icon.split('/')
        const filename = filenameArray[filenameArray.length - 1]
        await this.$http.delete('/removeFile', { data: { filename: filename }})
        this.onSearch()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    empty(form) {
      if (this.$refs[form]) {
        // 根据需求二选一
        /**
           * 移除校验结果并重置字段值
           * 注：清除表单项name的校验及数值
           */
        this.$refs[form].resetFields()
        /**
           * 移除校验结果
           * 注：只清除表单项name的校验，不清楚表单项name的数值
           */
        this.$refs[form].clearValidate()
      }
    },
    async submitForm(formName) {
      if (this.dialogId) {
        await this.$http.put(`/rest/photo/${this.dialogId}`, this.dialogForm)
      } else {
        await this.$http.post('/rest/photo', this.dialogForm)
      }
      this.$message({
        type: 'success',
        message: '保存成功'
      })
      this.dialogVisible = false
      this.onSearch()
    },
    resetForm(formName) {
      this.empty(formName)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
