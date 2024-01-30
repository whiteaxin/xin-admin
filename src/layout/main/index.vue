<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { ref, watch, nextTick } from 'vue'

//控制当前组件是否销毁重建(点击刷新了)
let flag = ref(true)

let LayOutSettingStore = useLayOutSettingStore()
//监听LayOutSettingStore.refresh是否发生了变化，如果发生了，则说明用户点击了刷新
watch(
  () => LayOutSettingStore.refresh,
  () => {
    //销毁组件
    flag.value = false
    //重建
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style scoped>
/* 动画 */
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
