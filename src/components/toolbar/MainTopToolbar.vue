<script setup>
import { NotificationsNoneOutlined } from '@vicons/material'
import { useThemeStore } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'
import Login from '@/components/login/Login.vue'
import Register from '@/components/login/Register.vue'

const themeStore = useThemeStore()
const { theme, isDarkTheme } = storeToRefs(themeStore)
const { changeTheme } = themeStore

// 是否展示登录对话框
const showLoginModal = ref(false)

// 登录模态框显示的内容（1：登录，2：注册，3：注册成功）
const loginModalStep = ref(2)
</script>

<template>
    <n-space align="center" justify="space-between" style="height: 100%;">
        <n-text type="info">
            ich笔记
        </n-text>
        <n-space>
            <!-- 头像 -->
            <n-avatar round size="small" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                style="position: relative;top: 3px;" />

            <!-- 分割线 -->
            <n-divider vertical style="position: relative;top: 5px;" />

            <!-- 消息 -->
            <n-badge dot processing type="success" :offset="[-8, 4]">
                <n-button circle tertiary>
                    <n-icon size="18" :component="NotificationsNoneOutlined"></n-icon>
                </n-button>
            </n-badge>

            <!-- 主题按钮 -->
            <n-button circle tertiary @click="changeTheme(!isDarkTheme)">
                <n-icon size="18" :component="theme.icon"></n-icon>
            </n-button>

            <!-- 登录按钮 -->
            <n-button tertiary type="primary" @click="showLoginModal = true">登录</n-button>
        </n-space>
    </n-space>

    <n-modal v-model:show="showLoginModal" transform-origin="center" :close-on-esc="false">
        <div style="width: 400px;">
            <!-- 登录卡片 -->
            <Login v-if="loginModalStep === 1" />
            <!-- 注册卡片 -->
            <Register v-if="loginModalStep === 2" />
        </div>
    </n-modal>
</template>