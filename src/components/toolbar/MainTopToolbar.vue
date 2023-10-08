<script setup>
import { DarkModeRound, NotificationsNoneOutlined } from '@vicons/material'
import { useThemeStore } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { theme, isDarkTheme } = storeToRefs(themeStore)
const { changeTheme } = themeStore
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
            <n-button tertiary type="primary">登录</n-button>
        </n-space>
    </n-space>
</template>