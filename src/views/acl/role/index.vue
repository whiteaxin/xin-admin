<template>
  <div class="search-div">
    <!-- 搜索表单 -->
    <div class="search-from" style="position: relative; padding-left: 10px">
      <el-form label-width="70px">
        <el-form-item label="角色名称">
          <el-input
            style="width: 80%"
            placeholder="请输入角色名称"
            v-model="queryDto.roleName"
          ></el-input>
        </el-form-item>
        <el-row style="display: flex">
          <el-button type="primary" @click="searchSysRole">搜索</el-button>
          <el-button @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 添加按钮 -->
    <div class="tools-div">
      <el-button type="success" @click="addShow">添 加</el-button>
    </div>

    <!-- 添加角色表单对话框 -->
    <el-dialog v-model="dialogVisible" title="添加或修改角色" width="30%">
      <el-form
        label-width="120px"
        :rules="rules"
        :model="sysRole"
        ref="ruleFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="角色Code" prop="roleCode">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="addCancle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--- 角色表格数据 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="roleCode" label="角色code" width="180" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" @click="editShow(scope.row)">修改</el-button>
        <el-button type="danger" @click="deleteById(scope.row)">删除</el-button>
      </el-table-column>
    </el-table>

    <!--分页条-->
    <div class="page" style="margin-top: 20px">
      <el-pagination
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        v-model:current-page="pageParamsForm.page"
        v-model:page-size="pageParamsForm.limit"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import {
  UpdateSysRole,
  reqAddRole,
  reqDeleteById,
  reqRolePageInfo,
} from '@/api/role/index'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { addRoleFrom } from '@/api/role/type'

//**************************分页搜索展示**************************** */
// 分页条总记录数
let total = ref(0)

// 定义表格数据模型
let list = ref([])

//分页数据
const pageParamsForm = ref({
  page: 1, // 页码
  limit: 5, // 每页记录数
})
// 搜索表单数据
const queryDto = ref({ roleName: '' })

// 页面加载完毕以后请求后端接口获取数据
onMounted(() => {
  fetchData()
})

// 搜索按钮点击事件处理函数
const searchSysRole = () => {
  //queryDto.value.roleName = ""
  fetchData()
}

// 远程调用后端分页查询接口
const fetchData = async () => {
  const result = await reqRolePageInfo(
    pageParamsForm.value.page,
    pageParamsForm.value.limit,
    queryDto.value,
  )
  list.value = result.data.records
  total.value = result.data.total
}

//重置按钮
const resetData = () => {
  queryDto.value.roleName = ''
  fetchData()
}

//**************************添加**************************** */

// 控制对话是否展示的变量
const dialogVisible = ref(false)
//表单数据模型
let sysRole = ref({
  id: '',
  roleCode: '',
  roleName: '',
})
//表单校验数据
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色code', trigger: 'blur' }],
})
//进入添加
const addShow = () => {
  sysRole.value = { id: '', roleCode: '', roleName: '' }
  dialogVisible.value = true
}
// 添加/修改角色
const submit = async () => {
  //保证表单都符合条件再发请求
  await ruleFormRef.value?.validate()
  if (!sysRole.value.id) {
    //添加
    const result: any = await reqAddRole(sysRole.value)
    if (result.code === 200) {
      dialogVisible.value = false
      ElMessage.success('操作成功')
      fetchData()
    }
  } else {
    //修改
    const result: any = await UpdateSysRole(sysRole.value)
    if (result.code === 200) {
      dialogVisible.value = false
      ElMessage.success('操作成功')
      fetchData()
    }
  }
}
//取消
const addCancle = () => {
  dialogVisible.value = false
  // if (!ruleFormRef.value) return
  ruleFormRef.value?.resetFields()
}

//**************************修改**************************** */
// 修改按钮点击事件处理函数
const editShow = (row: addRoleFrom) => {
  sysRole.value = { ...row }
  dialogVisible.value = true
}

//**************************删除**************************** */
const deleteById = (row: any) => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const result: any = await reqDeleteById(row.id)
    if (result.code === 200) {
      ElMessage.success('删除成功')
      pageParamsForm.value.page = 1
      fetchData()
    }
  })
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
