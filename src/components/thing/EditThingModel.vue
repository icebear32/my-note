<script setup>
import { computed, ref, h } from 'vue'
import { noteBaseRequest } from "@/request/note_request"
import { getUserToken, loginInvalid } from '@/utils/userLoginUtil'
import { AddBoxRound, DeleteForeverFilled } from '@vicons/material'
import { NText, NSpace, useNotification, useMessage, useLoadingBar } from 'naive-ui'

// 通知对象
const notification = useNotification()
// 消息对象
const message = useMessage()
// 加载条对象
const loadingBar = useLoadingBar()

// 自定义事件
const emits = defineEmits(['save'])

// 是否显示编辑小记模态框
const show = ref(false)

// 创建一个待办事项的
const onCreateTuDoThing = () => ({
    checked: false, // 是否已完成
    thing: '' // 待办事项
})

// 编辑小记表单值
const formValue = ref({
    id: null, // 小记编号（修改的用户）
    title: '', // 标题
    top: false, // 是否置顶
    tags: [], // 标签
    content: [], // 待办事项
    finished: computed(() => {
        const content = formValue.value.content // 待办事项

        if (content.length === 0) return false // 如果没有待办事项，则为：未完成
        return content.every(item => item.checked) // 如果有待办事项，判断是否都被选中，如果都被选中则为已完成
    })
})

// 编辑小记的表单引用
const formRef = ref(null)

//  编辑小记表单验证规则
const formRules = {
    title: {
        required: true,
        message: '请设置编辑小记的标题'
    },
    tags: {
        required: true,
        message: '请设置编辑小记的标签'
    },
    content: {
        required: true,
        message: '请设置编辑小记的待办事项'
    }
}

// 保存编辑的小记
const saveEditThing = () => {
    formRef.value?.validate(errors => {
        if (!errors) {
            if (formValue.value.id === null) {
                // 新增小记的保存
                newCreateSave()
            } else {
                // 修改小记的保存
            }
        } else {
            // 表单中所有验证错的对象
            const errorsMessage = [].concat(...errors)
            console.log(errorsMessage)
            notification.error({
                title: '编辑小记保存提醒',
                content: () => h(
                    NSpace,
                    { vertical: true },
                    {
                        default: () => errorsMessage.map(
                            (item, index) => h(
                                NText,
                                { type: 'error' },
                                {
                                    default: () => (index + 1) + ":" + item.message
                                }
                            )
                        )
                    }
                )
            })
        }
    })
}

// 是否处于加载中
const loading = ref(true)

/**
 * 显示编辑小记的模态框
 * @param {Number} id 小记编号（无值：新增小记；有值：修改小记）
 */
const showEditModal = id => {
    show.value = true // 显示编辑小记的模态框
    loading.value = true // 处于加载中
    // 判断是修改小记还是新增小记
    if (id === null) {
        // console.log('新增小记')
        loading.value = false // 加载已结束
    } else {
        formValue.value.id = id // 修改小记的编号
        // 发送请求（根据小记编号获取最新的小记信息）
        getEditThing(id)
    }
}

// 重置编辑的小记
const resetEditThing = () => {
    // console.log('模态框已关闭')
    formValue.value.id = null // 编号（修改小记）
    formValue.value.title = '' // 标题
    formValue.value.top = false // 是否置顶
    formValue.value.tags = [] // 标签
    formValue.value.content = [] // 待办事项
}

// 新增小记的保存
const newCreateSave = async () => {
    // 判断用户的登录状态
    const userToken = await getUserToken()
    loadingBar.start() // 加载条开始

    // 发送创建小记请求
    const title = formValue.value.title
    const top = formValue.value.top
    const tags = formValue.value.tags.join() // ['IT','计算机','科学'] => 'IT','计算机','科学'
    const content = JSON.stringify(formValue.value.content) // [{...},{...},{...}] => '[{...},{...},{...}]'
    const finished = formValue.value.finished
    const { data: responseData } = await noteBaseRequest.post(
        "/thing/create",
        { title, top, tags, content, finished },
        {
            headers: { userToken }
        }
    ).catch(() => {
        // 发送请求失败（404，500，400，...）
        loadingBar.error() // 加载条异常
        throw message.error("新增小记列表请求失败") // 新增小记列表请求失败的通知
    })
    // 得到服务器返回的数据，进行处理
    console.log(responseData)
    if (responseData.success) {
        loadingBar.finish() // 加载条结束
        message.success(responseData.message) // 显示发送请求成功的通知
        show.value = false // 关闭编辑小记窗口
        emits('save') // 触发保存事件（重新获取小记列表）
    } else {
        loadingBar.error() // 加载条异常结束 
        message.error(responseData.message) // 显示发送请求失败的通知 
        if (responseData.code === "L_008") {
            loginInvalid(true) // 登录失效
        }
    }
}

/**
 * 获取编辑的小记信息（修改小记的最新信息）
 * @param {Number} thingId 小记编号
 */
const getEditThing = async (thingId) => {
    // 判断用户的登录状态
    const userToken = await getUserToken()
    loadingBar.start() // 加载条开始

    // 发送获取编辑小记请求
    const { data: responseData } = await noteBaseRequest.get(
        "/thing/edit",
        {
            params: { thingId },
            headers: { userToken }
        }
    ).catch(() => {
        // 发送请求失败（404，500，400，...）
        loadingBar.error() // 加载条异常
        throw message.error("获取小记列表请求失败") // 获取编辑小记列表请求失败的通知
    })
    // 得到服务器返回的数据，进行处理
    console.log(responseData)
    if (responseData.success) {
        loadingBar.finish() // 加载条结束

        const editThing = responseData.data
        formValue.value.title = editThing.title // 标题
        formValue.value.top = editThing.top // 置顶
        formValue.value.tags = editThing.tags.split(',') // 标签 ['IT','计算机','科学']
        formValue.value.content = JSON.parse(editThing.content) // 内容

        loading.value = false // 加载已结束
    } else {
        loadingBar.error() // 加载条异常结束 
        message.error(responseData.message) // 显示发送请求失败的通知 
        if (responseData.code === "L_008") {
            loginInvalid(true) // 登录失效
        }
    }
}

// 将哪些函数导出
defineExpose({ showEditModal })
</script>

<template>
    <n-modal v-model:show="show" :auto-focus="false" :on-after-leave="resetEditThing">
        <div>
            <!-- 骨架屏卡片 -->
            <n-card v-show="loading" size="small" :bordered="false" style="width: 460px;">
                <template #default>
                    <div style="padding: 0 14px;">
                        <!-- 小记标题 -->
                        <n-skeleton :height="40" :sharp="false"></n-skeleton>
                    </div>
                    <!-- 置顶、标签容器、分割线、待办事项 -->
                    <div style="padding: 10px 14px 0;">
                        <!-- 置顶、标签容器 -->
                        <n-space align="center">
                            <!-- 置顶文本 -->
                            <n-skeleton :width="42" :height="22"></n-skeleton>
                            <!-- 置顶开关 -->
                            <n-skeleton :width="40" :height="22" :sharp="false"></n-skeleton>
                            <!-- 标签容器 -->
                            <n-space align="center">
                                <!-- 标签文本 -->
                                <n-skeleton :width="42" :height="14"></n-skeleton>
                                <!-- 标签创建开关 -->
                                <n-skeleton :width="38" :height="28" :sharp="false"></n-skeleton>
                            </n-space>
                        </n-space>
                        <!-- 分割线 -->
                        <n-divider style="margin-top: 14px;"></n-divider>
                        <!-- 待办事项列表 -->
                        <n-skeleton :height="34" :sharp="false"></n-skeleton>
                    </div>
                </template>
                <template #action>
                    <n-grid cols="2" :x-gap="12">
                        <n-gi>
                            <n-skeleton :height="34" :sharp="false"></n-skeleton>
                        </n-gi>
                        <n-gi>
                            <n-skeleton :height="34" :sharp="false"></n-skeleton>
                        </n-gi>
                    </n-grid>
                </template>
            </n-card>
            <!-- 编辑小记表单卡片 -->
            <n-card v-show="!loading" size="small" :bordered="false" style="width: 460px;"
                :class="{ 'thing-card-finished': formValue.finish }">
                <!-- 内容栏 -->
                <template #default>
                    <n-form ref="formRef" :model="formValue" :rules="formRules">
                        <n-form-item path="title">
                            <!-- 小记标题 -->
                            <n-input v-model:value="formValue.title" size="large" placeholder="请输入小记标题"
                                style="--n-border: none; background-color: transparent;" />
                        </n-form-item>
                        <!-- 置顶、标签容器、分割线、待办事项 -->
                        <div style="padding: 10px 14px 0;">
                            <!-- 置顶、标签容器 -->
                            <n-space align="center">
                                <n-text depth="3">置顶：</n-text>
                                <n-switch v-model:value="formValue.top" :round="false" />
                                <!-- 标签容器 -->
                                <n-space align="center">
                                    <n-form-item :show-label="false" :show-feedback="false" path="tags">
                                        <n-text depth="3">标签：</n-text>
                                        <n-dynamic-tags v-model:value="formValue.tags" :max="5"
                                            :color="{ borderColor: 'rgba(0, 0, 0, 0)' }" />
                                    </n-form-item>
                                </n-space>
                            </n-space>

                            <!-- 分割线 -->
                            <n-divider style="margin-top: 14px;"></n-divider>

                            <!-- 待办事项列表 -->
                            <n-form-item :show-label="false" :show-feedback="false" path="content">
                                <n-dynamic-input v-model:value="formValue.content" :on-create="onCreateTuDoThing">
                                    <template #create-button-default>
                                        添加一个待办事项
                                    </template>
                                    <template #default="{ value }">
                                        <div style="display: flex; align-items: center; width: 100%">
                                            <!-- 复选框（是否完成这个待办事项） -->
                                            <n-checkbox v-model:checked="value.checked" />
                                            <!-- 输入框（待办事项） -->
                                            <n-input v-model:value="value.thing" placeholder="请输入......"
                                                style="margin-left: 12px; --n-border: none;" />
                                        </div>
                                    </template>
                                    <template #action="{ index, create, remove, move }">
                                        <div style="display: flex; align-items: center; margin-left: 12px;">
                                            <!-- 添加按钮 -->
                                            <n-button circle tertiary type="tertiary" @click="() => create(index)"
                                                style="margin-right: 6px;">
                                                <n-icon :component="AddBoxRound"></n-icon>
                                            </n-button>
                                            <!-- 删除按钮 -->
                                            <n-button circle tertiary type="tertiary" @click="() => remove(index)">
                                                <n-icon :component="DeleteForeverFilled"></n-icon>
                                            </n-button>
                                        </div>
                                    </template>
                                </n-dynamic-input>
                            </n-form-item>
                        </div>
                    </n-form>
                </template>

                <!-- 功能栏 -->
                <template #action>
                    <n-grid cols="2" :x-gap="12">
                        <n-gi>
                            <n-button block tertiary @click="show = false">取消</n-button>
                        </n-gi>
                        <n-gi>
                            <n-button block ghost type="primary" @click="saveEditThing">保存</n-button>
                        </n-gi>
                    </n-grid>
                </template>
            </n-card>
        </div>
    </n-modal>
</template>

<style scoped>
.n-card.thing-card-finished {
    background-image: url("@/assets/finish.png");
    background-repeat: no-repeat;
    background-position: 360px 0;
    animation: finished 0.25s linear forwards;
}

@keyframes finished {
    from {
        background-size: 130px 130px;
    }

    to {
        background-size: 100px 100px;
    }
}
</style>