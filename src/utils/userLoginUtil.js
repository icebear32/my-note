import { useLoginModalStore } from "@/stores/loginModalStore"

/**
 * 获取本地存储中的 userToken 的值，如果没有则显示登录窗口
 * @returns { Promise<string> }
 */
export const getUserToken = async () => {
    const token = localStorage.getItem("userToken") // 获取本地存储中的 userToken 的值
    if (token === null) {
        // 未登录
        const { changeLoginModalShowStatus } = useLoginModalStore() // 该百年登录窗口显示的函数
        await changeLoginModalShowStatus(true) // 弹出登录窗口（结束）
        throw "未登录"
    } else {
        return token
    }
}