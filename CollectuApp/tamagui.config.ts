import { themes } from './styles/themes'
import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

const config = createTamagui({
  ...defaultConfig,
  themes,
  defaultTheme: 'base',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config