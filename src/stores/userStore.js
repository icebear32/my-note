import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 关于登录模态框的全局状态
export const useUserStore = defineStore(
  "user",
  () => {
    const id = ref(null) // 编号
    const email = ref(null) // 邮箱
    const nickname = ref(null) // 昵称
    const headPic = ref(null) // 头像
    const level = ref(null) // 等级
    const time = ref(null) // 注册时间

    // 用户头像地址
    const head_image = computed(() => {
      // 如果用户暂无图像，则使用默认头像，否则使用自己的图像
      if (headPic.value === null) {
        return "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
      } else {
        return headPic.value
      }
    })

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

    return { id, nickname, headPic, level, time, head_image, setUserInfo }
  },
  {
    persist: {
      storage: localStorage, // 本地存储
    }
  }
)
