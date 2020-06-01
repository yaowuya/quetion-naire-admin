<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm" class="pl-5">
      <el-form-item label="用户" prop="question">
        <el-select v-model="queryForm.person" clearable filterable placeholder="请选择" class="w-100">
          <el-option
            v-for="item in personList"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="调查问卷" prop="question">
        <el-select v-model="queryForm.question" clearable multiple placeholder="请选择" class="w-100">
          <el-option
            v-for="item in questionList"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="调查问卷" prop="question">
        <el-select v-model="queryForm.questionType" multiple placeholder="请选择" class="w-100">
          <el-option
            v-for="item in qtList"
            :key="item._id"
            :label="item.chinese"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click.stop="search()">查询</el-button>
        <!--        <el-button type="primary" @click.stop="create()">新增</el-button>-->
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
        <el-button size="mini" type="success" @click.stop="detail(row)">查看问卷</el-button>
        <!--        <el-button size="mini" @click.stop="update(row)">编辑</el-button>-->
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
        <el-form-item label="调查问卷" prop="question">
          <el-select v-model="ruleForm.question" placeholder="请选择" class="w-100">
            <el-option
              v-for="item in questionList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户" prop="question">
          <el-select v-model="ruleForm.person" placeholder="请选择" class="w-100">
            <el-option
              v-for="item in personList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="答案" prop="option">
          <el-select v-model="ruleForm.option" multiple placeholder="请选择" class="w-100">
            <el-option
              v-for="item in optionList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="ruleForm.content" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">取 消</el-button>
        <el-button type="primary" @click.native="save">确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      :visible.sync="drawerVisible"
      :with-header="false"
      :destroy-on-close="true"
      size="50%"
    >
      <AnswerComponent
        v-if="show"
        :person-id="personId"
        :question-id="questionId"
        :question-type-id="questionTypeId"
        @close-option="closeOption"
      />
    </el-drawer>
  </div>
</template>

<script>
import AnswerComponent from '@/views/question/component/AnswerComponent'
export default {
  name: 'Answer',
  components: { AnswerComponent },
  data() {
    return {
      queryForm: {
        person: '',
        question: [],
        questionType: []
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
            label: '用户',
            prop: 'person',
            overHidden: true,
            formatter: (row, value) => {
              return value ? value.name : null
            }
          },
          {
            label: '问卷',
            prop: 'question',
            overHidden: true,
            formatter: (row, value) => {
              return value ? value.name : null
            }
          },
          {
            label: '问卷类型',
            prop: 'questionType',
            overHidden: true,
            formatter: (row, value) => {
              return value ? value.chinese : null
            }
          },
          {
            label: '创建时间',
            prop: 'createTime',
            overHidden: true
          }
        ]
      },
      isEdit: false,
      centerDialogVisible: false,
      ruleForm: {
        person: null,
        question: null,
        content: '',
        option: []
      },
      rules: {
        person: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ],
        question: [
          { required: true, message: '请选择问卷', trigger: 'change' }
        ],
        option: [
          { required: true, message: '请选择选项', trigger: 'change' }
        ]
      },
      rowId: '',
      personList: [],
      questionList: [],
      optionList: [],
      qtList: [],
      drawerVisible: false,
      show: false,
      personId: '',
      questionId: '',
      questionTypeId: ''
    }
  },
  async created() {
    await this.search()
    await this.getAllPerson()
    await this.getAllQuestionType()
    await this.getAllQuestion()
    await this.getAllOption()
  },
  methods: {
    async getAllPerson() {
      const res = await this.$api.sys.getAllPerson({})
      if (res.result) {
        this.personList = res.data
      } else {
        this.$message.error(res.message)
      }
    },
    async getAllQuestion() {
      const res = await this.$api.question.getAllQuestion({})
      if (res.result) {
        this.questionList = res.data
      } else {
        this.$message.error(res.message)
      }
    },
    async getAllOption() {
      const res = await this.$api.question.getAllOption({})
      if (res.result) {
        this.optionList = res.data
      } else {
        this.$message.error(res.message)
      }
    },
    async getAllQuestionType() {
      const res = await this.$api.question.getAllQuestionType({})
      if (res.result) {
        this.qtList = res.data
      } else {
        this.$message.error(res.message)
      }
    },
    initForm() {
      this.ruleForm = {
        person: null,
        question: null,
        content: '',
        option: []
      }
    },
    async search() {
      this.page.currentPage = 1
      await this.query()
    },
    async query() {
      this.loading = true
      try {
        const res = await this.$api.question.getAnswer({
          person: this.queryForm.person,
          question: this.queryForm.question,
          questionType: this.queryForm.questionType,
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
    detail(row) {
      this.personId = row.person._id
      this.questionId = row.question._id
      this.questionTypeId = row.questionType._id
      this.drawerVisible = true
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    closeOption() {
      this.drawerVisible = false
    },
    async update(row) {
      this.centerDialogVisible = true
      this.isEdit = true
      this.ruleForm.person = row.person ? row.person._id : null
      this.ruleForm.question = row.question ? row.question._id : null
      const optionArray = []
      if (row.option.length > 0) {
        row.option.forEach(o => {
          optionArray.push(o._id)
        })
      }
      this.ruleForm.option = optionArray
      this.ruleForm.content = row.content
      this.rowId = row._id
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
        console.log(row)
        const res = await this.$api.question.deleteAnswer({
          personId: row.person._id,
          questionId: row.question._id,
          questionTypeId: row.questionType._id
        })
        this.loading = false
        if (res.result) {
          this.$message.success('删除成功')
          await this.query()
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
        const res = await this.$api.question.editAnswer({
          id: this.rowId,
          data: this.ruleForm
        })
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
        const res = await this.$api.question.addAnswer(this.ruleForm)
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
      this.$nextTick(() => {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
          this.$refs[formName].clearValidate()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>

