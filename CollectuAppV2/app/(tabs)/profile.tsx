import { useAuth } from "../../hooks/useAuth";
import { YStack, Text, Button } from "tamagui";
import { ThemeToggleButton } from '../../components/ThemeToggleButton';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding={20}>
      <ThemeToggleButton />
      <Text fontSize={24} fontWeight="bold" color="$color" marginBottom={20}>
        Profilo Utente
      </Text>
      <YStack width={320} padding={24} alignItems="center" borderRadius={18} backgroundColor="$color2" elevation={2}>
        {user ? (
          <>
            <Text color="$color" fontSize={16} marginBottom={10}>
              Email: {user.email}
            </Text>
            {/* Aggiungi altre informazioni del profilo qui */}
            <Button
              backgroundColor="$accent10"
              borderRadius={8}
              marginTop={20}
              width={180}
              color="$background"
              fontWeight="bold"
              fontSize={16}
              onPress={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Text color="$color" fontSize={16}>
            Caricamento informazioni utente...
          </Text>
        )}
      </YStack>
    </YStack>
  );
};

export default ProfileScreen;
