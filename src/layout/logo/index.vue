<template>
  <div
    class="logo"
    v-if="setting.logoHidden"
    :class="{ fold: LayOutSettingStore.fold ? true : false }"
  >
    <img :src="setting.logo" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting'
import useLayOutSettingStore from '@/store/modules/setting'

//控制图标切换
let LayOutSettingStore = useLayOutSettingStore()
</script>

<script lang="ts">
export default {
  name: 'Logo',
}
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-logo-height;
  display: flex;
  //竖着居中
  align-items: center;
  padding: 30px;

  img {
    width: 45px;
  }

  p {
    font-size: $base-logo-title-fontSize;
    font-weight: bolder;
    margin-left: 10px;
  }

  transition: all 0.3s;
  &.fold {
    padding: 15px;
  }
}
</style>
