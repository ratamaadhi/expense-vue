import { ref, watch, computed } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'expense-tracker-theme'

const theme = ref<Theme>((localStorage.getItem(STORAGE_KEY) as Theme) || 'system')

const resolvedTheme = ref<'light' | 'dark'>('light')

function updateResolvedTheme() {
  if (theme.value === 'system') {
    resolvedTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } else {
    resolvedTheme.value = theme.value
  }
}

function applyTheme(themeValue: 'light' | 'dark') {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(themeValue)
}

export function useTheme() {
  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    localStorage.setItem(STORAGE_KEY, newTheme)
    updateResolvedTheme()
    applyTheme(resolvedTheme.value)
  }

  function toggleTheme() {
    setTheme(resolvedTheme.value === 'light' ? 'dark' : 'light')
  }

  // Initialize
  updateResolvedTheme()
  applyTheme(resolvedTheme.value)

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (theme.value === 'system') {
      updateResolvedTheme()
      applyTheme(resolvedTheme.value)
    }
  })

  // Watch for theme changes
  watch(theme, () => {
    updateResolvedTheme()
    applyTheme(resolvedTheme.value)
  })

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: computed(() => resolvedTheme.value === 'dark'),
  }
}
