import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { useTheme } from '../../hooks/useTheme';
import { YStack, Text, Button } from 'tamagui';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <YStack style={{ flex: 1, alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: 20 }}>
      <Text fontSize={24} fontWeight="bold" style={{ color: 'var(--color)', marginBottom: 20 }}>
        Profilo Utente
      </Text>
      <ThemeSwitcher />
      <YStack style={{ width: 320, padding: 24, alignItems: 'center', borderRadius: 18, background: 'var(--color2)', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        {user ? (
          <>
            <Text style={{ color: 'var(--color)', fontSize: 16, marginBottom: 10 }}>
              Email: {user.email}
            </Text>
            {/* Aggiungi altre informazioni del profilo qui */}
            <Button
              style={{ background: 'var(--accent10)', borderRadius: 8, marginTop: 20, width: 180 }}
              color="var(--background)"
              fontWeight="bold"
              fontSize={16}
              onPress={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Text style={{ color: 'var(--color)', fontSize: 16 }}>
            Caricamento informazioni utente...
          </Text>
        )}
      </YStack>
    </YStack>
  );
};

export default ProfileScreen;