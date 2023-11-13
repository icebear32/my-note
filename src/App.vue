<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, watch } from "vue"
import RootViewVue from './views/RootView.vue'
import { useUserStore } from "./stores/userStore"
import { useThemeStore } from '@/stores/themeStore'

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
    }
  })
})
</script>

<template>
  <n-config-provider :theme="theme.name">
    <n-loading-bar-provider>
      <n-notification-provider>
        <!-- n-dialog-provider：对话框 -->
        <n-dialog-provider>
          <!-- n-message-provider：消息容器 -->
          <n-message-provider>
            <RootViewVue />
          </n-message-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped></style>
