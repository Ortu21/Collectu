import { Button } from 'tamagui';
import { useTheme } from 'tamagui';
import { useContext } from 'react';
import { ThemeContext } from '../theme/ThemeContext';

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const tamaguiTheme = useTheme();

  return (
    <Button
      onPress={toggleTheme}
      backgroundColor={tamaguiTheme.accent10?.val}
      color={tamaguiTheme.background?.val}
      borderRadius={10}
      fontWeight="bold"
      fontSize={14}
      margin={8}
    >
      {theme === 'dark' ? 'Tema Chiaro' : 'Tema Scuro'}
    </Button>
  );
};
