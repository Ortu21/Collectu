import { TamaguiProvider } from 'tamagui';
import { config } from '../tamagui.config';
import { AuthProvider } from '../hooks/useAuth';
import { ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <TamaguiProvider config={config}>
      <AuthProvider>{children}</AuthProvider>
    </TamaguiProvider>
  );
}
