<script setup>
import MainTopToolbar from '@/components/toolbar/MainTopToolbar.vue';
</script>

<template>
  <n-layout position="absolute" style="border: 1px solid black;">
    <!-- 应用头 -->
    <n-layout-header bordered style="height: 64px;padding: 0 20px;">
      <MainTopToolbar />
    </n-layout-header>
    <n-layout position="absolute" style="top: 64px;" has-sider>
      <!-- 左侧应用栏目 -->
      <n-layout-sider bordered width="64px" content-style="padding: 24px 0;text-align: center;">
        海淀桥
      </n-layout-sider>
      <!-- 主页面 -->
      <n-layout-content content-style="padding: 24px;">
        平山道
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped></style>
