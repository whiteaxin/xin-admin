import { dividerProps } from 'element-plus'; <
<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
      <!-- 展示菜单 -->
      <el-scrollbar class="scrollbar">
        <el-menu
          :collapse="LayOutSettingStore.fold ? true : false"
          :default-active="$route.path"
          background-color="#ffffff"
          text-color="#303133"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div
      class="layout_tabbar"
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div
      class="layout_main"
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import useUserStore from '@/store/modules/user'
import { useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/modules/setting'

//控制图标切换
let LayOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
let $route = useRoute()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    border-right: 1px solid #d6d4d4;
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed; //固定定位
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background: $base-tabbar-color;
    top: 0px;
    left: $base-menu-width;
    border-bottom: 1px solid #d6d4d4;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
      border-left: 1px solid #d6d4d4;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background-color: $basee-main-color;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    //内容超出时在容器内滚动
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
      border-left: 1px solid #d6d4d4;
    }
  }
}
</style>
