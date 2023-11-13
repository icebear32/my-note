<script setup>
import { ref, inject } from "vue"
import { useDialog } from 'naive-ui'
import LoginModal from '@/components/login/LoginModal.vue'
import MainTopToolbar from '@/components/toolbar/MainTopToolbar.vue'
import MainLeftToolbar from "@/components/toolbar/MainLeftToolbar.vue"

// 对话框对象
const dialog = useDialog()

// 接收祖先组件提供的数据：是否重新加载页面
const needReload = inject('needReload')

// 如果 needReload 的值为 true 时，则重新加载页面的对话框
watch(
    () => needReload.value,
    newData => {
        if (newData) {
            changeLoginStatusDialog() // 弹出重新加载页面的对话框
        }
    }
)

// 登录改变状态的对话框
const loginStatusDialog = ref(null)

// 登录状态发生改变的对话框，显示重新加载页面的对话框
const changeLoginStatusDialog = () => {
    // dialog.destroyAll() // 销毁已出现的所有对话框

    if (loginStatusDialog.value === null) {
        // 弹出对话框
        loginStatusDialog.value = dialog.create({
            // title: '警告',
            showIcon: false,
            closable: false,
            closeOnEsc: false,
            maskClosable: false,
            content: '登陆状态已改变，需要重新加载页面！',
            positiveText: '重新加载页面',
            positiveButtonProps: {
                tertiary: true
            },
            onPositiveClick: () => {
                window.location.reload() // 重新加载页面
                return false
            }
        })
    }
}
</script>

<template>
    <!-- 布局 -->
    <n-layout position="absolute">
        <!-- 应用头 -->
        <n-layout-header bordered style="height: 64px;padding: 0 20px;">
            <MainTopToolbar />
        </n-layout-header>
        <n-layout position="absolute" style="top: 64px;" has-sider>
            <!-- 左侧应用栏目 -->
            <n-layout-sider bordered width="64px" content-style="padding: 24px 0;text-align: center;">
                <MainLeftToolbar />
            </n-layout-sider>
            <!-- 主页面 -->
            <n-layout-content>
                <RouterView />
            </n-layout-content>
        </n-layout>
    </n-layout>
    <!-- 登录模态框 -->
    <LoginModal />
</template>