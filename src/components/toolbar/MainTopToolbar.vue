<script setup>
import { NotificationsNoneOutlined } from '@vicons/material'
import { storeToRefs } from "pinia"
import { useThemeStore } from '@/stores/themeStore'
import { useLoginModalStore } from "../../stores/loginModalStore"
import { useUserStore } from '../../stores/userStore'

const themeStore = useThemeStore()
const { theme, isDarkTheme } = storeToRefs(themeStore)
const { changeTheme } = themeStore

// 登录模态框共享资源的对象
const loginModalStore = useLoginModalStore()

// 改变登录模态框显示的状态
const { changeLoginModalShowStatus } = loginModalStore

// 用户的共享数据
const userStore = useUserStore()
const { id: user_id, head_image, nickName, levelInfo } = storeToRefs(userStore)
</script>

<template>
    <n-space align="center" justify="space-between" style="height: 100%;">
        <n-text type="info">
            ich笔记
        </n-text>
        <n-space>
            <!-- 头像 -->
            <n-popover trigger="click" width="260" content-style="padding: 10px">
                <template #trigger>
                    <n-button circle :bordered="false">
                        <n-avatar round v-if="user_id !== null" :src="head_image" />
                    </n-button>
                </template>
                <n-thing :title="nickName">
                    <template #avatar>
                        <n-avatar size="large" round :src="head_image" />
                    </template>
                    <template #description>
                        <n-space align="center">
                            <n-tag size="small" :bordered="false" type="success">{{ levelInfo }}</n-tag>
                            <n-text depth="3">2099-12-31 到期</n-text>
                        </n-space>
                    </template>
                </n-thing>
            </n-popover>

            <!-- 分割线 -->
            <n-divider v-if="user_id !== null" vertical style="position: relative;top: 5px;" />

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
            <n-button v-if="user_id === null" tertiary type="primary"
                @click="changeLoginModalShowStatus(true)">登录</n-button>
        </n-space>
    </n-space>
</template>
