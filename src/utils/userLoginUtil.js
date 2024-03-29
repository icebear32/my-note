import { useLoginModalStore } from "@/stores/loginModalStore"
import { useUserStore } from '@/stores/userStore'

/**
 * 获取本地存储中的 userToken 的值，如果没有则显示登录窗口
 * @returns { Promise<string> }
 */
export const getUserToken = async () => {
    const { token } = useUserStore() // 用户 store 对象中的重置用户信息的函数
    // const token = localStorage.getItem("userToken") // 获取本地存储中的 userToken 的值
    // if (token === null) {
    //     // 未登录
    //     const { changeLoginModalShowStatus } = useLoginModalStore() // 改变登录窗口显示的函数
    //     await changeLoginModalShowStatus(true) // 弹出登录窗口（结束）
    //     throw "未登录"
    // } else {
    //     return token
    // }

    // 更改
    // token 有值则直接返回
    if (token) return token
    // token 无值，则弹出登录窗口
    const {changeLoginModalShowStatus} = useLoginModalStore() // 改变登录窗口显示的函数
    await changeLoginModalShowStatus(true) // 弹出登录窗口（结束）
}

/**
 * 登录失效
 * @param { Boolean } show 是否显示登录窗口
 */
export const loginInvalid = show => {
    const { resetUserInfo } = useUserStore()
    resetUserInfo() // 重置用户的登录状态
    if (show) {
        // 未登录
        const { changeLoginModalShowStatus } = useLoginModalStore() // 改变登录窗口显示的函数
        changeLoginModalShowStatus(true) // 弹出登录窗口（结束）
    }
}