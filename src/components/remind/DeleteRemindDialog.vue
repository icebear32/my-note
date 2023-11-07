<script setup>
import { ReportGmailerrorredRound } from "@vicons/material"

defineProps({
    describe: { type: String, required: true }, // 提醒描述
    deleteBtn: { type: Boolean, default: true }, // 删除按钮是否显示
    completeDeleteBtn: { type: Boolean, default: true }, // 彻底删除按钮是否显示
})

// 自定义事件：彻底删除事件、删除事件、取消事件
const emits = defineEmits(['completeDeleteBtn', 'delete', 'cancel'])
</script>

<template>
    <n-modal :show="true" type="warning" preset="dialog" title="删除提醒" :closable="false">
        <template #icon>
            <n-icon style="position: relative;top: -2px;" :component="ReportGmailerrorredRound"></n-icon>
        </template>
        <template #default>{{ describe }}</template>
        <template #action>
            <!-- 彻底删除按钮 -->
            <n-button v-if="completeDeleteBtn" size="small" tertiary type="error" @click="emits('completeDeleteBtn', '彻底删除')">彻底删除</n-button>
            <!-- 删除按钮 -->
            <n-button v-if="deleteBtn" size="small" secondary type="error" @click="emits('deleteBtn', '删除')">删除</n-button>
            <!-- 取消按钮 -->
            <n-button size="small" tertiary  @click="emits('cancel', '取消')">取消</n-button>
        </template>
    </n-modal>
</template>

<style scoped></style>