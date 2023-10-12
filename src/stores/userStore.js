import { defineStore } from 'pinia'
import { ref } from 'vue'

// 关于登录模态框的全局状态
export const useUserStore = defineStore(
  "user",
  () => {
    const id = ref(null) // 编号
    const email = ref('') // 邮箱
    const nickname = ref('') // 昵称
    const headPic = ref('') // 头像
    const level = ref(0) // 等级
    const time = ref('') // 注册时间

    /**
     * 设置用户信息
     * @param {Number} u_id 编号
     * @param {String} u_email 邮箱
     * @param {String} u_nickname 昵称
     * @param {String} u_headPic 头像
     * @param {Number} u_level 等级
     * @param {String} u_time 注册时间
     */
    const setUserInfo = (u_id, u_email, u_nickname, u_headPic, u_level, u_time) => {
      id.value = u_id
      email.value = u_email
      nickname.value = u_nickname
      headPic.value = u_headPic
      level.value = u_level
      time.value = u_time
    }

    return { id, nickname, headPic, level, time, setUserInfo }
  },
  {
    persist: {
      storage: localStorage, // 本地存储
    }
  }
)
