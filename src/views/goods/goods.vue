<template>
  <section class="goods">
    <el-row class="mt-10 px-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="formInline.name" placeholder="名称" />
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
        align="center"
        label="广告图"
        width="200"
      >
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="height:50px;">
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
      class="dialog"
    >
      <el-form ref="ruleForm" :model="dialogForm" label-position="left" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品图片">
              <el-input v-model="dialogForm.icon" class="display-none" />
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="dialogForm.name" />
            </el-form-item>
            <el-form-item label="商品来源" prop="from">
              <el-input v-model="dialogForm.from" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="现在价格" prop="nowPrice">
              <el-input v-model="dialogForm.nowPrice" />
            </el-form-item>
            <el-form-item label="其他价格" prop="otherPrice">
              <el-input v-model="dialogForm.otherPrice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="划线价格" prop="underlinePrice">
              <el-input v-model="dialogForm.underlinePrice" />
            </el-form-item>
            <el-form-item label="链接" prop="url">
              <el-input v-model="dialogForm.url" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品类型">
              <el-select v-model="dialogForm.category" class="w-100">
                <el-option
                  v-for="item of categories"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="商品信息" prop="info">
              <el-input
                v-model="dialogForm.info"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5}"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
  name: 'Goods',
  components: {
    Table
  },
  data() {
    return {
      categories: [],
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
        from: '',
        ticket: '',
        nowPrice: '',
        underlinePrice: '',
        otherPrice: '',
        info: '',
        url: '',
        category: ''
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
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await this.$http.get('/rest/category')
      this.categories = [...res]
    },
    initCol() {
      this.columns = [
        { label: '商品名称', prop: 'name', sortable: true, fixed: true },
        { slot: 'picture' },
        { label: '商品分类', prop: 'category.name' },
        { label: '商品信息', prop: 'info', width: '200' },
        { label: '商品来源', prop: 'from' },
        { label: '现在价格', prop: 'nowPrice' },
        { label: '划线价格', prop: 'underlinePrice' },
        { label: '其他价格', prop: 'otherPrice' },
        { label: '链接', prop: 'url', width: '300' },
        { slot: 'operate' }
      ]
    },
    search(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.onSearch()
    },
    async onSearch() {
      const res = await this.$http.post('/page/good/good/pageList', {
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
        this.dialogForm.category = row.category._id
        this.empty('ruleForm')
      })
    },
    handleDelete(index, row) {
      this.$confirm(`是否确定要删除商品 "${row.name}"`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$http.delete(`/rest/good/${row._id}`)
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
        await this.$http.put(`/rest/good/${this.dialogId}`, this.dialogForm)
      } else {
        await this.$http.post('/rest/good', this.dialogForm)
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

<style scoped lang="scss">
  /deep/ .el-dialog__body {
    max-height: 400px !important;
    overflow-y: scroll;
  }
</style>
