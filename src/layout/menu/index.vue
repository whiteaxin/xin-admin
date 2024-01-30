<template>
  <template v-for="menu in menuList" :key="menu.path">
    <!-- 没有子菜单 -->
    <template v-if="!menu.children">
      <el-menu-item
        :index="menu.path"
        v-if="!menu.meta.hidden"
        @click="goRoute"
      >
        <el-icon>
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ menu.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 只有一个子菜单，直接展示就可以 -->
    <template v-if="menu.children && menu.children.length == 1">
      <el-menu-item
        :index="menu.children[0].path"
        v-if="!menu.children[0].meta.hidden"
        @click="goRoute"
      >
        <el-icon>
          <component :is="menu.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ menu.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有多个子菜单 -->
    <el-sub-menu
      :index="menu.path"
      v-if="menu.children && menu.children.length > 1"
    >
      <template #title>
        <el-icon>
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <span>{{ menu.meta.title }}</span>
      </template>
      <!-- 递归 -->
      <Menu :menuList="menu.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { RouteLocationRaw, useRouter } from 'vue-router'

defineProps(['menuList'])
let $router = useRouter()

//点击菜单的回调
const goRoute = (vc: { index: RouteLocationRaw }) => {
  $router.push(vc.index)
}
</script>

<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style scoped></style>
