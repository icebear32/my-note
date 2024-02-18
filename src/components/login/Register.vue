<script setup>
import { ref } from 'vue'
import { disabledBtn } from '@/utils/disabledBtn'
import { useMessage, useLoadingBar } from 'naive-ui'
import { noteBaseRequest } from "@/request/note_request"
import { EmailOutlined, LockOpenOutlined, FormatColorResetFilled } from '@vicons/material'
import noteServeRequest from "@/request"
import mailApi from '@/request/api/mailApi'

// 自定义事件
const emits = defineEmits(['changeStep'])
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
// 是否禁用注册按钮
const registerBtnDisabled = ref(false)
// 点击注册按钮去注册
const toRegister = (e) => {
    e.preventDefault()
    registerFormRef.value?.validate(async (errors) => {
        if (!errors) {
            // 是否获取验证码
            const vcKey = emailVcKey.value
            if (vcKey === '' || vcKey === null) {
                throw message.error("请先获取验证码")
            }
            // 判断接收验证码的邮箱是否和注册的邮箱一致
            const vc_email = vcKey.split(":")[1] // 接收验证码的邮箱
            const email = registerFormValue.value.email // 注册账号的邮箱
            if (email !== vc_email) {
                throw message.error("注册邮箱号发生变化，请重新获取")
            }

            loadingBar.start() // 加载条开始
            // registerBtnDisabled.value = true // 禁用注册按钮
            disabledBtn(registerBtnDisabled, true) // 禁用注册按钮

            // 发送注册请求
            const { data: responseData } = await noteBaseRequest.post(
                "/user/register/email",
                {
                    email,
                    vc: registerFormValue.value.vc,
                    vcKey
                }
            ).catch(() => {
                // 发送请求失败（404，500，400，...）
                loadingBar.error() // 加载条异常
                message.error("注册请求失败") // 发送登录请求失败的通知
                disabledBtn(registerBtnDisabled, false, true, 2.5) // 解除禁用注册按钮

                throw "发送注册请求失败"
            })

            // 得到服务器返回的数据，进行处理
            console.log(responseData)
            if (responseData.success) {
                loadingBar.finish() // 加载条结束
                emits('changeStep', 3) // 跳转至注册成功界面
            } else {
                loadingBar.error() // 加载条异常结束 
                message.error(responseData.message) // 显示注册失败的通知 
                setTimeout(() => {
                    registerBtnDisabled.value = false // 解除禁用注册按钮
                }, 2500)
            }
        }
    })
}

// ----- 获取验证码 -----
// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()
// 验证码查询的关键词
const emailVcKey = ref('')
// 按钮状态
const btnCountDown = ref({
    text: '获取验证码', // 按钮显示的文本
    time: 60, // 还有多少秒结束
    disabled: false, // 是否禁用按钮
    clock: null
})

// 按钮倒计时
const buttonCountDown = () => {
    btnCountDown.value.clock = setInterval(() => {
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
const getEmailVC = async () => {
    // 表单验证（只验证邮箱输入框规则）
    await registerFormRef.value?.validate(
        async errors => {
            if (errors) throw "表单验证失败"
        },
        (rule) => rule?.key === "mail"
    )

    // 按钮倒计时
    buttonCountDown()
    // 获取请求的 Api
    let API = { ...mailApi.getRegisterVC }
    // 封装 URL 的参数
    API.params = { email: registerFormValue.value.email }
    // 发送请求
    noteServeRequest(API).then(responseData => {
        if (!responseData) return
        // 存储查询验证码的关键词
        emailVcKey.value = responseData.data
    })
}
</script>

<template>
    <n-card>
        <!-- 前往登录 -->
        <n-space justify="space-between" align="center">
            <h2>注册</h2>
            <n-text depth="3">
                已有账号？
                <n-button text type="info" @click="emits('changeStep', 1)">前往登录</n-button>
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
                <n-button block type="success" :disabled="registerBtnDisabled" @click="toRegister">注册</n-button>
            </n-form-item>
        </n-form>
    </n-card>
</template>

<style scoped></style>