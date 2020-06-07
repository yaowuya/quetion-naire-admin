<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm" class="pl-5">
      <el-form-item label="用户" prop="question">
        <el-select v-model="queryForm.person" multiple clearable filterable placeholder="请选择" class="w-100">
          <el-option
            v-for="item in personList"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.role.chinese }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click.stop="search()">查询</el-button>
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
<!--        <el-button size="mini" type="danger" @click.stop="remove(row)">删除</el-button>-->
      </template>
    </avue-crud>
    <el-drawer
      :visible.sync="drawerVisible"
      :with-header="false"
      :destroy-on-close="true"
      size="50%"
    >
      <DashComponent v-if="show" :person-id="personId" :person-name="personName" />
    </el-drawer>
  </div>
</template>

<script>
import DashComponent from '@/views/dashboard/component/DashComponent'
export default {
  name: 'Dashboard',
  components: { DashComponent },
  data() {
    return {
      queryForm: {
        person: []
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
        menuWidth: 200,
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
            label: '身份',
            prop: 'role',
            overHidden: true,
            formatter: (row, value) => {
              return row.person.role.chinese
            }
          },
          {
            label: '问卷',
            prop: 'question',
            overHidden: true,
            width: '450',
            formatter: (row, value) => {
              const result = []
              if (value.length > 0) {
                value.forEach(v => {
                  result.push(v.name)
                })
                return result.join('、')
              } else {
                return ''
              }
            }
          },
          {
            label: '问卷',
            prop: 'createTime',
            overHidden: true
          }
        ]
      },
      personList: [],
      drawerVisible: false,
      show: false,
      personId: '',
      personName: ''
    }
  },
  async created() {
    await this.query()
    await this.getAllPerson()
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
    async search() {
      this.page.currentPage = 1
      await this.query()
    },
    async query() {
      this.loading = true
      try {
        const res = await this.$api.question.getAnswerMerge({
          person: this.queryForm.person,
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
    detail(row) {
      this.personId = row.person._id
      this.personName = row.person.name
      this.drawerVisible = true
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    closeOption() {
      this.drawerVisible = false
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
    localLoading() {
      const loading = this.$loading({ lock: true })
      return loading
    }
  }
}
</script>

<style scoped lang="scss">
</style>

