<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
      <div class="button">
        <el-button
          size="small"
          icon="Refresh"
          circle
          @click="refresh"
        ></el-button>
        <el-button
          size="small"
          icon="FullScreen"
          circle
          @click="fullscreen"
        ></el-button>
        <el-button size="small" icon="Setting" circle></el-button>
      </div>
      <Avatar></Avatar>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon :size="20" class="el-icon--right">
            <DCaret />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            <el-dropdown-item>GitHub仓库</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from './avatar/index.vue'
import Breadcrumb from './breadcrumb/index.vue'
import useLayOutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router'

let LayOutSettingStore = useLayOutSettingStore()
let useStore = useUserStore()
let $router = useRouter()

//刷新
const refresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}

//全屏
const fullscreen = () => {
  //判断当前是不是全屏，不是全屏返回null，是返回true
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

//退出登录
const logout = async () => {
  useStore.userLogout()
  $router.push({ path: '/login' })
}
</script>

<script lang="ts">
export default {
  name: 'tabbar',
}
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  // background-image: linear-gradient(to right,rgb(160, 153, 154),white,rgb(160, 153, 154));
  .tabbar_left {
    margin-left: 20px;
    display: flex;
    //竖着居中
    align-items: center;
  }

  .tabbar_right {
    .button {
      margin-right: 20px;
    }

    display: flex;
    align-items: center;
    margin-right: 10px;
  }
}
</style>
