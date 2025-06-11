import { themes } from './themes'
import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
  ...defaultConfig,
  themes,
  defaultTheme: 'dark',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
})