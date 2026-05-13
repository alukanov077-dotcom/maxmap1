const tg = typeof window !== 'undefined' && (window as any).Telegram?.WebApp

export const telegram = {
  ready: () => {
    tg?.ready()
  },
  expand: () => {
    tg?.expand()
  },
  close: () => {
    tg?.close()
  },
  setBackButton: (callback: () => void) => {
    if (!tg) return
    tg.BackButton.show()
    tg.BackButton.onClick(callback)
  },
  hideBackButton: () => {
    if (!tg) return
    tg.BackButton.hide()
    tg.BackButton.offClick()
  },
  haptic: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    if (!tg) return
    if (type === 'success' || type === 'error') {
      tg.HapticFeedback.notificationOccurred(type)
    } else {
      tg.HapticFeedback.impactOccurred(type)
    }
  },
  getTheme: () => tg?.colorScheme || 'light',
  getUser: () => tg?.initDataUnsafe?.user || null,
}

