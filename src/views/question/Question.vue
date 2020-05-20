<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm" class="pl-5">
      <el-form-item label="问卷名称">
        <el-input v-model="queryForm.name" placeholder="请输入问卷名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click.stop="search()">查询</el-button>
        <el-button type="primary" @click.stop="create()">新增</el-button>
      </el-form-item>
    </el-form>
    <avue-crud
      ref="crud"
      :data="data"
      :option="option"
      :page.sync="page"
      :table-loading="loading"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template slot="menu" slot-scope="{row}">
        <el-button size="mini" @click.stop="update(row)">编辑</el-button>
        <el-button size="mini" type="danger" @click.stop="remove(row)">删除</el-button>
      </template>
    </avue-crud>
    <el-dialog
      :title="isEdit?'编辑':'新增'"
      :visible.sync="centerDialogVisible"
      width="50%"
      center
    >
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px">
        <el-form-item label="问卷名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="分类" prop="belong">
          <el-input v-model="ruleForm.belong" />
        </el-form-item>
        <el-form-item label="说明" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">取 消</el-button>
        <el-button type="primary" @click.native="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Question',
  data() {
    return {
      queryForm: {
        name: ''
      },
      page: {
        pageSizes: [10, 20, 30, 40], // 默认
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      data: [],
      rolesList: [],
      loading: false,
      option: {
        emptyText: '暂无数据',
        columnBtn: false,
        refreshBtn: false,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        border: true,
        stripe: true,
        selection: false,
        indexFixed: false,
        selectionFixed: false,
        align: 'center',
        menuAlign: 'center',
        menuWidth: 250,
        column: [
          {
            label: '问卷名称',
            prop: 'name',
            overHidden: true
          },
          {
            label: '分类',
            prop: 'belong',
            overHidden: true
          },
          {
            label: '说明',
            prop: 'desc',
            overHidden: true
          }
        ]
      },
      isEdit: false,
      centerDialogVisible: false,
      ruleForm: {
        _id: '',
        name: '',
        desc: '',
        belong: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入问卷名称', trigger: 'blur' }
        ]
      }
    }
  },
  async created() {
    await this.search()
  },
  methods: {
    initForm() {
      this.ruleForm = {
        _id: '',
        name: '',
        desc: '',
        belong: ''
      }
    },
    async search() {
      this.page.currentPage = 1
      await this.query()
    },
    async query() {
      this.loading = true
      try {
        const res = await this.$api.question.getQuestion({
          name: this.queryForm.name,
          pageSize: this.page.pageSize,
          pageNum: this.page.currentPage
        })
        if (res.result) {
          this.page.total = res.total
          this.data = res.data
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    sizeChange(val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.query()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.query()
    },
    create() {
      this.resetForm('ruleForm')
      this.initForm()
      this.centerDialogVisible = true
      this.isEdit = false
    },
    async update(row) {
      this.centerDialogVisible = true
      this.isEdit = true
      this.ruleForm = this.$CopyRow(this.ruleForm, row)
    },
    remove(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        confirmButtonClass: 'el-button--danger'
      }).then(async() => {
        this.loading = true
        const res = await this.$api.question.deleteQuestion({ _id: row._id })
        this.loading = false
        if (res.result) {
          this.$message.success('删除成功')
          this.query()
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.loading = false
      })
    },
    cancel() {
      this.centerDialogVisible = false
    },
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.edit()
          } else {
            this.add()
          }
        } else {
          return false
        }
      })
    },
    async edit() {
      const loading = this.localLoading()
      try {
        const res = await this.$api.question.editQuestion(this.ruleForm)
        if (res.result) {
          this.centerDialogVisible = false
          this.$message.success('修改成功')
          this.query()
        } else {
          this.$message.error(res.message)
        }
        loading.close()
      } catch (e) {
        loading.close()
      }
    },
    async add() {
      const loading = this.localLoading()
      try {
        const res = await this.$api.question.addQuestion(this.ruleForm)
        if (res.result) {
          this.centerDialogVisible = false
          this.$message.success('新增成功')
          this.query()
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
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
        this.$refs[formName].clearValidate()
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
