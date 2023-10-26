<script setup>
import { h } from 'vue'
import { storeToRefs } from "pinia"
import { NIcon } from 'naive-ui'
import { NotificationsNoneOutlined, AccountBoxFilled, ManageAccountsFilled, LogOutRound } from '@vicons/material'
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

// 读取图标
const renderIcon = icon => {
    return () => h(NIcon, null, { default: () => h(icon) })
}
// 用户菜单选项
const userMenu = [
    {
        key: 'user-center',
        label: '个人中心',
        icon: renderIcon(AccountBoxFilled)
    },
    {
        key: 'account-setting',
        label: '账户设置',
        icon: renderIcon(ManageAccountsFilled)
    },
    {
        key: 'sign-out',
        label: '退出登录',
        icon: renderIcon(LogOutRound)
    }
]
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
                <!-- 用户头像菜单的头像部分 -->
                <n-thing :title="nickName">
                    <template #avatar>
                        <n-avatar size="large" round :src="head_image" style="position: relative;top: 3px;" />
                    </template>
                    <!-- 用户头像菜单的简介部分 -->
                    <template #description>
                        <n-space align="center">
                            <n-tag size="small" :bordered="false" type="success">{{ levelInfo }}</n-tag>
                            <n-text depth="3">2099-12-31 到期</n-text>
                        </n-space>
                    </template>
                    <!-- 用户头像菜单的用户菜单选项部分 -->
                    <template #default>
                        <!-- 分割线 -->
                        <n-divider style="margin: 5px auto;"></n-divider>
                        <!-- 菜单选项 -->
                        <n-menu id="user-header-menu" :options="userMenu" />
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

<style scoped>
.n-menu#user-header-menu:deep(.n-menu-item-content) {
    padding-left: 18px !important;
}
</style>