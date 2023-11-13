<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { disabledBtn } from '@/utils/disabledBtn'
import { useMessage, useLoadingBar } from 'naive-ui'
import { noteBaseRequest } from "@/request/note_request"
import { useLoginModalStore } from "@/stores/loginModalStore"
import { EmailOutlined, LockOpenOutlined } from '@vicons/material'

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
const toLogin = (e) => {
    e.preventDefault()
    loginFormRef.value?.validate(async (errors) => {
        if (!errors) {
            loadingBar.start() // 加载条开始
            // loginBtnDisabled.value = true // 禁用登录按钮
            disabledBtn(loginBtnDisabled, true) // 禁用登录按钮

            // 发送登录请求
            const { data: responseData } = await noteBaseRequest.post(
                "/user/login/email/password",
                {
                    email: loginFormValue.value.email,
                    password: loginFormValue.value.password
                }
            ).catch(() => {
                // 发送请求失败（404，500，400，...）
                loadingBar.error() // 加载条异常
                message.error("发送登录请求失败") // 发送登录请求失败的通知
                disabledBtn(loginBtnDisabled, false, true, 2.5) // 解除禁用登录按钮

                throw "发送登录请求失败"
            })

            // 得到服务器返回的数据，进行处理
            console.log(responseData)
            disabledBtn(loginBtnDisabled, false, true, 2.5) // 解除禁用登录按钮
            if (responseData.success) {
                loadingBar.finish() // 加载条结束
                message.success(responseData.message) // 显示登录成功的通知
                changeLoginModalShowStatus(false) // 关闭登录模态框
                localStorage.setItem("userToken", responseData.data.userToken) // 将查询 redis 中的用户关键词存到本地存储中

                const user = responseData.data.user; // 登录的用户信息
                setUserInfo(
                    user.id,
                    user.email,
                    user.nickname,
                    user.headPic,
                    user.level,
                    user.time
                )
            } else {
                loadingBar.error() // 加载条异常结束 
                message.error(responseData.message) // 显示登录失败的通知 
            }
        }
    })
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