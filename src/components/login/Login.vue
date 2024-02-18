<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { disabledBtn } from '@/utils/disabledBtn'
import { useMessage, useLoadingBar } from 'naive-ui'
import { noteBaseRequest } from "@/request/note_request"
import { useLoginModalStore } from "@/stores/loginModalStore"
import { EmailOutlined, LockOpenOutlined } from '@vicons/material'
import noteServeRequest from "@/request"
import userApi from '@/request/api/userApi'

// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()

// 自定义事件
const emits = defineEmits(['changeStep'])

// 登录模态框共享资源对象
const loginModalStore = useLoginModalStore()
// 改变登录模态框显示的状态（函数）
const { changeLoginModalShowStatus } = loginModalStore

// 用户共享的资源对象
const userStore = useUserStore()
// 改变用户信息的函数
const { setUserInfo } = userStore

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

// 登录表单引用
const loginFormRef = ref(null)

// 禁用登录按钮
const loginBtnDisabled = ref(null)

// 点击登录按钮去登录
const toLogin = async (e) => {
    // 取消默认行为
    e.preventDefault()

    // 表单验证
    await loginFormRef.value?.validate(async (errors) => {
        if (errors) throw "表单验证失败"
    })
    // 禁用登录按钮
    disabledBtn(loginBtnDisabled, true)
    // 获取请求的 API
    let API = { ...userApi.loginEmailPassword }
    // 封装请求体中（data）的参数
    API.data = {
        email: loginFormValue.value.email,
        password: loginFormValue.value.password
    }
    // 发送请求
    await noteServeRequest(API).then(responseData => {
        if (!responseData) return
        // 关闭登录模态框
        changeLoginModalShowStatus(false)
        // 登录的用户信息
        const user = responseData.data.user;
        setUserInfo(
            responseData.data.userToken,
            user.id,
            user.email,
            user.nickname,
            user.headPic,
            user.level,
            user.time
        )
    })

    // 解除禁用登录按钮
    disabledBtn(loginBtnDisabled, false, true, 2.5)
}
</script>

<template>
    <n-card>
        <!-- 前往注册 -->
        <n-space justify="space-between" align="center">
            <h2>登录</h2>
            <n-text depth="3">
                暂无账号？
                <n-button text type="info" @click="emits('changeStep', 2)">前往注册</n-button>
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
                <n-input placeholder="请输入密码" type="password" show-password-on="click"
                    v-model:value="loginFormValue.password">
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
                <n-button block type="success" :disabled="loginBtnDisabled" @click="toLogin">登录</n-button>
            </n-form-item>
        </n-form>

        <!-- 忘记密码 -->
        <n-space justify="center" style="cursor: pointer;">
            <n-text depth="3">忘记密码</n-text>
        </n-space>
    </n-card>
</template>

<style scoped></style>