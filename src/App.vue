<script setup>
import { onMounted } from "vue";
import MainTopToolbar from '@/components/toolbar/MainTopToolbar.vue'
import { useThemeStore } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'
import LoginModal from '@/components/login/LoginModal.vue'

// 主题的共享资源
const themeStore = useThemeStore()
// 主题
const { theme } = storeToRefs(themeStore)
// 改变主题
const { changeTheme } = themeStore

onMounted(() => {
  window.addEventListener('storage', event => {
    // 监听主题是否发生改变
    if (event.key === 'theme') {
      const newTheme = JSON.parse(event.newValue) // 新值
      // console.log(newTheme)
      changeTheme(newTheme.isDarkTheme) // 改变主题
    }
  })
})
</script>

<template>
  <n-config-provider :theme="theme.name">
    <n-loading-bar-provider>
      <!-- n-message-provider：消息容器 -->
      <n-message-provider>
        <n-layout position="absolute">
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
        <!-- 登录模态框 -->
        <LoginModal />
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped></style>
