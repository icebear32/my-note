<script setup>
import { onMounted, watch } from "vue";
import { storeToRefs } from 'pinia'
import { useUserStore } from "./stores/userStore"
import { useThemeStore } from '@/stores/themeStore'
import LoginModal from '@/components/login/LoginModal.vue'
import MainTopToolbar from '@/components/toolbar/MainTopToolbar.vue'
import MainLeftToolbar from "@/components/toolbar/MainLeftToolbar.vue";

// ===== 主题 =====
// 主题的共享资源
const themeStore = useThemeStore()
// 主题
const { theme } = storeToRefs(themeStore)
// 改变主题
const { changeTheme } = themeStore

// ===== 用户 =====
// 用户的共享资源
const userStore = useUserStore()
// 用户登录的 token 值
const { token } = storeToRefs(userStore)
// 如果用户的登录状态发生变化，重新加载页面
watch(
  () => token.value,
  newData => {
    if (newData !== null) location.reload()
  }
)

onMounted(() => {
  window.addEventListener('storage', event => {
    // 监听主题是否发生改变
    if (event.key === 'theme') {
      const newTheme = JSON.parse(event.newValue) // 新值
      // console.log(newTheme)
      changeTheme(newTheme.isDarkTheme) // 改变主题
    } else if (event.key === 'user') {
      // console.log('用户登录状态发生变化')
      location.reload() // 用户登录状态发生变化：强制刷新页面
    }
  })
})
</script>

<template>
  <n-config-provider :theme="theme.name">
    <n-loading-bar-provider>
      <n-notification-provider>
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
                <MainLeftToolbar />
              </n-layout-sider>
              <!-- 主页面 -->
              <n-layout-content>
                <RouterView />
              </n-layout-content>
            </n-layout>
          </n-layout>
          <!-- 登录模态框 -->
          <LoginModal />
        </n-message-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped></style>
