<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref, provide } from "vue"
import RootViewVue from './views/RootView.vue'
import { useUserStore } from "./stores/userStore"
import { useThemeStore } from '@/stores/themeStore'

// ===== 主题 =====
// 主题的共享资源
const themeStore = useThemeStore()
// 主题
const { theme } = storeToRefs(themeStore)

// ===== 用户 =====
// 用户的共享资源
const userStore = useUserStore()

// 是否需要重新加载页面
const needReload = ref(false)

// 为后代组件提供数据
provide('needReload', needReload)

onMounted(() => {
  window.addEventListener('storage', event => {
    // 监听主题是否发生改变
    if (event.key === 'theme') {

      // const newTheme = JSON.parse(event.newValue) // 新值
      // changeTheme(newTheme.isDarkTheme) // 改变主题
      themeStore.$hydrate() // 将本地存储的主题数据恢复到 store 中
    } else if (event.key === 'user') {
      // 判断是否是 token 值发生变化
      const newToken = JSON.parse(event.newValue).token
      const oldToken = JSON.parse(event.oldValue).token
      if (newToken === oldToken) {
        userStore.$hydrate() // 将本地存储的用户数据恢复到 store 中
      } else {
        // 需要重新加载页面
        needReload.value = true
        setTimeout(() => {
          needReload.value = false
        }, 1000)
      }
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
