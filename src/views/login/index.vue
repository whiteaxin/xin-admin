<template>
  <div class="h-screen font-sans login bg-cover">
    <div
      class="container mx-auto h-full flex flex-1 justify-center items-center"
    >
      <div class="relative mx-10 sm:max-w-sm w-full">
        <div
          class="card bg-blue-400 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"
        ></div>
        <div
          class="card bg-red-400 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"
        ></div>
        <div
          class="relative w-full rounded-3xl px-6 py-4 bg-gray-100 shadow-md"
        >
          <label
            for=""
            class="block mt-3 text-2xl text-gray-700 text-center font-semibold"
          >
            登录
          </label>
          <form class="mt-10" @submit.prevent="login">
            <div class="relative">
              <input
                v-model="loginForm.username"
                @blur="validateUserAccount"
                placeholder="请输入账号"
                class="mt-1 pl-2 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
              />
              <span v-if="loginError.userAccountError" class="text-red-500">
                {{ loginError.userAccountError }}
              </span>
            </div>

            <div class="mt-7 relative">
              <input
                v-model="loginForm.password"
                @blur="validateUserPassword"
                type="password"
                placeholder="请输入密码"
                class="mt-1 pl-2 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
              />
              <span v-if="loginError.userPasswordError" class="text-red-500">
                {{ loginError.userPasswordError }}
              </span>
            </div>

            <div class="mt-7 relative flex">
              <input
                v-model="loginForm.captcha"
                type="captcha"
                placeholder="请输入验证码"
                class="mt-1 mr-8 pl-2 block border-none w-40 bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
              />
              <img :src="captchaSrc" @click="refreshCaptcha" />
            </div>

            <div class="mt-10 flex">
              <label
                for="remember_me"
                class="inline-flex items-center w-full cursor-pointer"
              >
                <input
                  id="remember_me"
                  type="checkbox"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  name="remember"
                />
                <span class="ml-2 text-sm text-gray-600">记住我</span>
              </label>

              <div class="w-full text-right">
                <a class="underline text-sm text-gray-600 hover:text-gray-900">
                  忘记密码
                </a>
              </div>
            </div>

            <div class="mt-7">
              <button
                class="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
              >
                登录
              </button>
            </div>

            <div class="flex mt-7 items-center text-center">
              <hr class="border-gray-300 border-1 w-full rounded-md" />
              <label class="block font-medium text-sm text-gray-600 w-full">
                第三方登录
              </label>
              <hr class="border-gray-300 border-1 w-full rounded-md" />
            </div>

            <div class="flex mt-7 justify-center w-full">
              <div
                class="mr-5 flex justify-center items-center bg-blue-500 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
              >
                <i-mdi-qqchat style="font-size: 1em; color: #fff" />
                <span class="ml-1">QQ</span>
              </div>
              <div
                class="flex justify-center items-center bg-green-600 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
              >
                <i-mdi-wechat style="font-size: 1.2em; color: #fff" />
                <span class="ml-1">微信</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { loginForm } from '@/api/user/type'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
import { GetValidateCode } from '@/api/user'

let loginForm = reactive({
  username: '',
  password: '',
  captcha: '',
  codeKey: '',
})
let loginError = reactive({ userAccountError: '', userPasswordError: '' })
//图片验证码地址
let captchaSrc = ref('')

let userStore = useUserStore()
let router = useRouter()

onMounted(() => {
  refreshCaptcha()
})

//登录按钮的回调
const login = async () => {
  try {
    if (validateUserAccount() || validateUserPassword()) {
      ElNotification({
        type: 'error',
        message: '输入信息有误',
      })
      return
    }
    await userStore.userLogin(loginForm)
    router.push({ path: '/' })
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `HI,${getTime()}好`,
    })
  } catch (error) {
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
    refreshCaptcha()
  }
}

//获取验证码
const refreshCaptcha = async () => {
  const { data } = await GetValidateCode()
  loginForm.codeKey = data.codeKey
  captchaSrc.value = data.codeValue
}

//表单校验账号
const validateUserAccount = () => {
  let regex = /^[0-9]{8,32}$/
  if (!regex.test(loginForm.username)) {
    loginError.userAccountError = '请输入8~32位的数字'
    return true
  } else {
    loginError.userAccountError = ''
    return false
  }
}
//表单校验密码
const validateUserPassword = () => {
  let regex = /^\w{8,32}$/
  if (!regex.test(loginForm.password)) {
    loginError.userPasswordError = '请输入8~32位的字母、数字、下划线'
    return true
  } else {
    loginError.userPasswordError = ''
    return false
  }
}
</script>

<style lang="scss" scoped>
.login {
  background: url('@/assets/image/background.webp');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
