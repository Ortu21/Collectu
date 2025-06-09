import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Button, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { AVAILABLE_THEMES } from '../hooks/useTheme';

const themeNames = AVAILABLE_THEMES;

const themeLabels: Record<string, string> = {
  base: 'Base',
  accent: 'Accent',
  // aggiungi qui altre label se aggiungi altri temi
};

const themeIcons: Record<string, string> = {
  base: 'sunny',
  accent: 'color-palette',
  // aggiungi qui altre icone se aggiungi altri temi
};

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <XStack gap="$2" style={{ margin: 16 }}>
      {themeNames.map((name) => (
        <Button
          key={name}
          themeInverse={theme === name}
          onPress={() => setTheme(name)}
          size="$3"
          icon={
            <Ionicons
              name={themeIcons[name] as any}
              size={18}
              color={theme === name ? '#fff' : '#888'}
            />
          }
        >
          <Text>{themeLabels[name] || name}</Text>
        </Button>
      ))}
    </XStack>
  );
};

export default ThemeSwitcher;
