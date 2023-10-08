<script setup>
import { NotificationsNoneOutlined, EmailOutlined, LockOpenOutlined } from '@vicons/material'
import { useThemeStore } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { theme, isDarkTheme } = storeToRefs(themeStore)
const { changeTheme } = themeStore

// 是否展示登录对话框
const showLoginModal = ref(false)
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
            <n-card>
                <n-space justify="space-between" align="center">
                    <h2>登录</h2>
                    <n-text depth="3">
                        暂无账号？
                        <n-button text type="info">前往注册</n-button>
                    </n-text>
                </n-space>
                
                <!-- 登录表单 -->
                <n-form>
                    <n-form-item label="邮箱号码">
                        <n-input placeholder="请输入邮箱号码">
                            <template #prefix>
                                <n-icon :component="EmailOutlined" />
                            </template>
                        </n-input>
                    </n-form-item>
                    <n-form-item label="密码">
                        <n-input placeholder="请输入密码" type="password">
                            <template #prefix>
                                <n-icon :component="LockOpenOutlined" />
                            </template>
                        </n-input>
                    </n-form-item>
                    <n-form-item :show-label="false">
                        <n-checkbox>同意本公司的</n-checkbox>
                        <n-button text type="info">《条款与协议》</n-button>
                    </n-form-item>
                    <n-form-item :show-label="false">
                        <n-button block type="success">登录</n-button>
                    </n-form-item>
                </n-form>

                <n-space justify="center" style="cursor: pointer;">
                    <n-text depth="3">忘记密码</n-text>
                </n-space>
            </n-card>
        </div>
    </n-modal>
</template>