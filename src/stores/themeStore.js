import { darkTheme } from 'naive-ui'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { DarkModeRound, LightbulbOutlined } from '@vicons/material'

// 关于主题的全局状态
export const useThemeStore = defineStore("theme", () => {
  // 是否是暗系主题
  const isDarkTheme = ref(false)

  // 暗系主题-灯泡，亮系主题-月牙
  const theme = computed(() => {
    if (isDarkTheme.value) {
      // 暗系主题
      return {
        name: darkTheme,
        icon: LightbulbOutlined
      }
    } else {
      // 亮系主题
      return {
        name: null,
        icon: DarkModeRound
      }
    }
  })

  /**
   * 更改主题
   * @param {Boolean} dark 是否是暗系 
   */
  const changeTheme = dark => {
    isDarkTheme.value = dark
  }

  return { isDarkTheme, theme, changeTheme }
})
