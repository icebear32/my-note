import axios from "axios"
import qs from 'qs'
import { createDiscreteApi } from 'naive-ui'
import { loginInvalid, getUserToken } from '@/utils/userLoginUtil'

// 自定义函数 ----------------------------------

// 脱离上下文的 消息和加载条 对象
const { message, loadingBar } = createDiscreteApi(["message", "loadingBar"])

/**
 * 请求时处理
 * @param config 配置
 */
const request = async config => {
    // 加载条开始
    loadingBar.start()
    // 判断是否需要请求头的 uerToken 参数
    if (config.usePower) config.headers.userToken = await getUserToken()
    // 是否需要将请求体中的参数转成 URL 的参数
    if (config.dataParam) config.transformRequest = [data => qs.stringify(data)]
    // 返回最终的配置
    return config
}

/**
 * 请求失败
 * @param {*} error 失败信息
 */
const requestError = error => {
    // 加载条异常结束
    loadingBar.error()
    // 采用消息块展示失败的原因
    message.error("发送" + error.config.name + "请求失败")
    // 返回失败原因
    // return Promise.reject(error)
}

/**
 * 响应处理
 * @param {*} response 响应数据
 */
const requestResponse = response => {
    // 得到服务器中返回的数据
    const responseData = response.data
    // 判断是否请求成功
    if (!responseData.success) {
        // 加载条异常结束
        loadingBar.error()
        // 弹出失败的原因
        message.error(responseData.message)
        // 判断是否未登录失效 -- 如果则是弹出登录的窗口
        if (responseData.code === "L_008") loginInvalid(true) // 登录失效
        // 无数据返回给调用者
        return null
    }
    // 加载条正常结束
    loadingBar.finish()
    // 判断是否需要弹出请求成功的消息
    if (response.config.successMessage) message.success(response.config.name + "成功")
    // 将服务器的数据返回给后面的调用者
    return responseData
}

// -------------------------------------------

// 自定义的请求对象
export const noteServeRequest = axios.create({
    baseURL: '/note-serve'
})

// 请求拦截器
noteServeRequest.interceptors.request.use(config => request(config), error => requestError(error))

// 响应拦截器
noteServeRequest.interceptors.response.use(response => requestResponse(response), error => requestError(error))

// 导出请求对象
export default noteServeRequest