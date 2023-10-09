<script setup>
import { NotificationsNoneOutlined, EmailOutlined, LockOpenOutlined, FormatColorResetFilled } from '@vicons/material'
import { useThemeStore } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { theme, isDarkTheme } = storeToRefs(themeStore)
const { changeTheme } = themeStore

// 是否展示登录对话框
const showLoginModal = ref(false)

// 登录表单值
const loginFormValue = ref({
    email: '',
    password: '',
    trim: false
})

// 登录表单验证规则
const loginFormRules = {
    email: [
        {
            required: true,
            message: "请输入邮箱号码",
            trigger: ["input", "blur"]
        },
        {
            message: "请正确输入邮箱格式",
            trigger: ["input", "blur"],
            validator: (rule, value) => {
                return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)
            }
        }
    ],
    password: {
        required: true,
        message: "请输入密码",
        trigger: ["input", "blur"]
    },
    trim: {
        message: "请认真阅读本公司的条款与协议",
        trigger: "change",
        validator: (rule, value) => {
            return value
        }
    }
}

const loginFormRef = ref(null)

// 点击登录按钮去登录
const toLogin = (e) => {
    e.preventDefault()
    loginFormRef.value?.validate((errors) => {
        if (!errors) {
            alert('登陆成功')
        }
    })
}
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
                <!-- 前往注册 -->
                <n-space justify="space-between" align="center">
                    <h2>登录</h2>
                    <n-text depth="3">
                        暂无账号？
                        <n-button text type="info">前往注册</n-button>
                    </n-text>
                </n-space>

                <!-- 登录表单 -->
                <n-form :model="loginFormValue" :rules="loginFormRules" ref="loginFormRef">
                    <n-form-item label="邮箱号码" path="email" first>
                        <n-input placeholder="请输入邮箱号码" v-model:value="loginFormValue.email">
                            <template #prefix>
                                <n-icon :component="EmailOutlined" />
                            </template>
                        </n-input>
                    </n-form-item>
                    <n-form-item label="密码" path="password">
                        <n-input placeholder="请输入密码" type="password" v-model:value="loginFormValue.password">
                            <template #prefix>
                                <n-icon :component="LockOpenOutlined" />
                            </template>
                        </n-input>
                    </n-form-item>
                    <n-form-item :show-label="false" path="trim">
                        <n-checkbox v-model:checked="loginFormValue.trim">同意本公司的</n-checkbox>
                        <n-button text type="info">《条款与协议》</n-button>
                    </n-form-item>
                    <n-form-item :show-label="false">
                        <n-button block type="success" @click="toLogin">登录</n-button>
                    </n-form-item>
                </n-form>

                <!-- 忘记密码 -->
                <n-space justify="center" style="cursor: pointer;">
                    <n-text depth="3">忘记密码</n-text>
                </n-space>
            </n-card>
        </div>
    </n-modal>
</template>