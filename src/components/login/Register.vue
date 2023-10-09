<script setup>
import { EmailOutlined, LockOpenOutlined, FormatColorResetFilled } from '@vicons/material'
import { ref } from 'vue'

// 注册表单值
const registerFormValue = ref({
    email: '',
    vc: '',
    trim: false
})

// 注册表单验证规则
const registerFormRules = {
    email: [
        {
            required: true,
            message: "请输入邮箱号码",
            trigger: ["input", "blur"]
        },
        {
            key: 'mail',
            message: "请正确输入邮箱格式",
            trigger: ["input", "blur"],
            validator: (rule, value) => {
                return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)
            }
        }
    ],
    vc: {
        required: true,
        message: "请输入验证码",
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

// 注册表单引用
const registerFormRef = ref(null)

// 点击注册按钮去注册
const toRegister = (e) => {
    e.preventDefault()
    registerFormRef.value?.validate((errors) => {
        if (!errors) {
            alert('注册成功')
        }
    })
}

// ----- 获取验证码 -----
// 按钮状态
const btnCountDown = ref({
    text: '获取验证码', // 按钮显示的文本
    time: 60, // 还有多少秒结束
    disabled: false, // 是否禁用按钮
    clock: null
})

// 按钮倒计时
const buttonCountDown = () => {
    btnCountDown.value.clock = setInterval(()=>{
        if (btnCountDown.value.time === 1) {
            // 不需要倒计时 - 重置获取验证码的状态
            resetButtonCountDownStatus()
        } else {
            // 需要倒计时
            btnCountDown.value.disabled = true //禁用按钮
            btnCountDown.value.time-- // 时间递减
            btnCountDown.value.text = btnCountDown.value.time + '秒重新获取' // 按钮显示的文本
        }
    }, 1000)
}

// 重置获取验证码的状态
const resetButtonCountDownStatus = () => {
    // 清除任务
    clearInterval(btnCountDown.value.clock)

    btnCountDown.value.text = "获取验证码"
    btnCountDown.value.time = 60
    btnCountDown.value.disabled = false
}

// 获取验证码
const getEmailVC = () => {
    registerFormRef.value?.validate(
        (errors) => {
            if (!errors) {
                buttonCountDown() //按钮倒计时
            }
        },
        (rule) => {
            return rule?.key === "mail"
        }
    )
}
</script>

<template>
    <n-card>
        <!-- 前往登录 -->
        <n-space justify="space-between" align="center">
            <h2>注册</h2>
            <n-text depth="3">
                已有账号？
                <n-button text type="info">前往登录</n-button>
            </n-text>
        </n-space>

        <!-- 注册表单 -->
        <n-form :model="registerFormValue" :rules="registerFormRules" ref="registerFormRef">
            <n-form-item label="邮箱号码" path="email" first>
                <n-input placeholder="请输入邮箱号码" v-model:value="registerFormValue.email">
                    <template #prefix>
                        <n-icon :component="EmailOutlined" />
                    </template>
                </n-input>
            </n-form-item>

            <n-grid :cols="2" :x-gap="24">
                <n-form-item-gi label="验证码" path="vc">
                    <n-input placeholder="请输入验证码" v-model:value="registerFormValue.vc" />
                </n-form-item-gi>
                <n-form-item-gi>
                    <n-button block secondary type="success" :disabled="btnCountDown.disabled" @click="getEmailVC">
                        {{ btnCountDown.text }}
                    </n-button>
                </n-form-item-gi>
            </n-grid>

            <n-form-item :show-label="false" path="trim">
                <n-checkbox v-model:checked="registerFormValue.trim">同意本公司的</n-checkbox>
                <n-button text type="info">《条款与协议》</n-button>
            </n-form-item>
            <n-form-item :show-label="false">
                <n-button block type="success" @click="toRegister">注册</n-button>
            </n-form-item>
        </n-form>
    </n-card>
</template>

<style scoped></style>