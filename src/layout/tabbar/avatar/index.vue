<script setup lang="ts">
import { useNow, useDateFormat } from '@vueuse/core'
import useUserStore from '@/store/modules/user'

const formatted = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm')
let useStore = useUserStore()
</script>

<template>
  <el-avatar shape="square" :size="40" :src="useStore.avatar" />
  <div class="flex ml-1">
    <div class="flex flex-col items-start">
      <span class="font-sans dark:text-white text-gray-600 text-sm font-medium">
        你好,管理员{{ useStore.name }}
      </span>
      <span class="font-sans dark:text-white text-gray-500 text-sm">
        {{ formatted }}
      </span>
    </div>
  </div>
</template>

<style scoped></style>
