<template>
  <!---搜索表单-->
  <div class="search-div">
    <el-form label-width="80px">
      <el-row style="display:flex;  justify-content:space-between;">
        <el-col :span="12">
          <el-form-item label="关键字:">
            <el-input v-model="queryDto.keyword" style="width: 90%" placeholder="用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间:">
            <el-date-picker v-model="createTimes" type="daterange" range-separator="To" start-placeholder="开始时间"
              end-placeholder="结束时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="display:flex">
        <el-button type="primary" @click="searchSysUser">
          搜索
        </el-button>
        <el-button @click="resetData">重置</el-button>
      </el-row>
    </el-form>
  </div>

  <!--添加按钮-->
  <div class="tools-div">
    <el-button type="success" @click="addShow">添 加</el-button>
  </div>

  <!---数据表格-->
  <el-table :data="list" style="width: 100%">
    <el-table-column prop="username" label="用户名" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="phone" label="手机" />
    <el-table-column prop="avatar" label="头像" #default="scope">
      <img :src="scope.row.avatar" width="50" />
    </el-table-column>
    <el-table-column prop="status" label="状态" #default="scope">
      {{ scope.row.status == 1 ? '正常' : '停用' }}
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button type="primary" @click="editSysUser(scope.row)">
        修改
      </el-button>
      <el-button type="danger" @click="deleteById(scope.row)">
        删除
      </el-button>
      <el-button type="warning" @click="showAssignRole(scope.row)">
        分配角色
      </el-button>
    </el-table-column>
  </el-table>

  <!-- 新增/修改对话框 -->
  <el-dialog v-model="dialogVisible" title="添加或修改" width="40%">
    <el-form label-width="120px" ref="ruleFormRef" :rules="rules" :model="sysUser">
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="sysUser.username" />
      </el-form-item>
      <el-form-item v-if="sysUser.id == null" label="密码:" prop="password">
        <el-input type="password" show-password v-model="sysUser.password" />
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input v-model="sysUser.name" />
      </el-form-item>
      <el-form-item label="手机:" prop="phone">
        <el-input v-model="sysUser.phone" />
      </el-form-item>
      <el-form-item label="头像:" prop="avatar">
        <el-upload class="avatar-uploader" action="http://localhost:8848/api/file/fileUpload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :headers="headers">
          <img v-if="sysUser.avatar" :src="sysUser.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 分配角色 -->
  <el-dialog v-model="dialogRoleVisible" title="分配角色" width="40%">
    <el-form label-width="80px">
        <el-form-item label="用户名">
            <el-input disabled :value="sysUser.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
            <el-checkbox-group v-model="userRoleIds">
                <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">
                    {{ role.roleName }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="doAssign">提交</el-button>
            <el-button @click="dialogRoleVisible = false">取消</el-button>
        </el-form-item>
    </el-form>
</el-dialog>

  <!-- 分页条 -->
  <div class="page" style="margin-top: 20px;">
    <el-pagination v-model:current-page="pageParams.page" v-model:page-size="pageParams.limit"
      :page-sizes="[5, 10, 15, 20]" @size-change="fetchData" @current-change="fetchData"
      layout="total, sizes, prev, pager, next" :total="total" />
  </div>
</template>

<script lang = "ts" setup>
import { DoAssignRoleToUser, GetSysUserListByPage, deleteSysUserById, saveSysUser, updateSysUser } from '@/api/user';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import useUserStore from '@/store/modules/user';
import { GetAllRoleList } from '@/api/role';
const userStore = useUserStore();


// ************************************分页查询*************************
// 表格数据模型
const list = ref([]);

// 分页条数据模型
const total = ref(0)

// 定义搜索表单数据模型
let queryDto = ref({
  keyword: "",
  createTimeBegin: "",
  createTimeEnd: ""
})
const createTimes: any = ref([])

//分页数据
const pageParams = ref({
  page: 1, // 页码
  limit: 10, // 每页记录数
})

// onMounted钩子函数
onMounted(() => {
  fetchData();
})

// 搜素按钮点击事件处理函数
const searchSysUser = () => {
  fetchData()
}

// 重置按钮点击事件处理函数
const resetData = () => {
  queryDto.value = {
    keyword: "",
    createTimeBegin: "",
    createTimeEnd: ""
  }
  createTimes.value = []
}

// 定义分页查询方法
const fetchData = async () => {
  if (createTimes.value.length == 2) {
    queryDto.value.createTimeBegin = createTimes.value[0]
    queryDto.value.createTimeEnd = createTimes.value[1]
  }
  // 请求后端接口进行分页查询
  const result: any = await GetSysUserListByPage(pageParams.value.page, pageParams.value.limit, queryDto.value)
  if (result.code == 200) {
    list.value = result.data.records
    total.value = result.data.total
  }
}


// ************************************新增/修改*************************
// 添加表单对话框显示隐藏控制变量
const dialogVisible = ref(false)

// 定义提交表单数据模型
const sysUser = ref({
  username: "",
  name: "",
  phone: "",
  password: "",
  avatar: ""
})

//弹出对话框
const addShow = () => {
  sysUser.value = {
    username: "",
    name: "",
    phone: "",
    password: "",
    avatar: ""
  }
  dialogVisible.value = true
}

// 提交按钮事件处理函数
const submit = async () => {
  //保证表单都符合条件再发请求
  await ruleFormRef.value?.validate()
  if (!sysUser.value.id) {//说明是修改
    const result: any = await saveSysUser(sysUser.value)
    if (result.code === 200) {
      dialogVisible.value = false
      ElMessage.success('操作成功')
      fetchData()
    } else {
      ElMessage.error(result.message)
    }
  } else {
    const result: any = await updateSysUser(sysUser.value)
    if (result.code === 200) {
      dialogVisible.value = false
      ElMessage.success('操作成功')
      fetchData()
    } else {
      ElMessage.error(result.message)
    }
  }

}

//自定义规则校验：手机号码自定义规则校验
const validatorPhone = (_rule: any, value: any, callback: any) => {
  const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的手机号码'))
  }
}
//todo:其他的校验
//表单校验数据
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名称', trigger: 'blur' }],

  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }],

  phone: [{ validator: validatorPhone, message: '请输入电话号', trigger: 'blur' }],

  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],

  avatar: [{ required: true, message: '请输入头像', trigger: 'blur' }],
})

const cancle = () => {
  dialogVisible.value = false
  // if (!ruleFormRef.value) return
  ruleFormRef.value?.resetFields()
}

// 修改按钮点击事件处理函数
const editSysUser = (row: any) => {
  dialogVisible.value = true
  sysUser.value = { ...row }
}


// ************************************图片上传*************************
const headers = {
  token: userStore.token     // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
}

// 图像上传成功以后的事件处理函数
const handleAvatarSuccess = (response:any, uploadFile:any) => {
  sysUser.value.avatar = response.data
}


// ***********************************删除*************************
// 删除角色
const deleteById = (row: any) => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const result: any = await deleteSysUserById(row.id)
    if (result.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    }
  })
}

// ***********************************分配角色*************************

// 角色列表
const userRoleIds = ref([])
const allRoles = ref([
    {"id":1 , "roleName":"管理员"},
    {"id":2 , "roleName":"业务人员"},
    {"id":3 , "roleName":"商品录入员"},
])
const dialogRoleVisible = ref(false)

const showAssignRole = async (row:any) => {
  sysUser.value = row
  dialogRoleVisible.value = true

  // 查询所有的角色数据
  const result:any = await GetAllRoleList(row.id) ;
  allRoles.value = result.data.allRolesList

  // 获取当前登录用户的角色数据
  userRoleIds.value = result.data.userRolesList
}

const doAssign = async () => {
    let assginRoleVo = {
        userId: sysUser.value.id ,
        roleIdList: userRoleIds.value
    }
    const result:any = await DoAssignRoleToUser(assginRoleVo) ;
    if(result.code === 200) {
        ElMessage.success('操作成功')
        dialogRoleVisible.value = false 
        fetchData()
    }
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
