import { useState, useEffect } from 'react';
import { YStack, Input, Button, Text, Spinner, useTheme } from 'tamagui';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { getAuthErrorMessage } from '../../utils/authErrorMessages';

export default function Login() {
  const [loginError, setLoginError] = useState('');
  const { login, error, loading, user, clearError } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    // Pulisci errori quando il componente viene smontato o cambia route
    return () => {
      clearError();
      setLoginError('');
    };
  }, []);

  useEffect(() => {
    if (!loading && user) {
      clearError();
      setLoginError('');
      router.replace('/(tabs)/collectibles');
    }
  }, [user, loading, router, clearError]);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoginError('');
    clearError();
    try {
      await login(data.email, data.password, false);
    } catch (e) {
      setLoginError(error || 'Login failed');
    }
  };

  const handleGoToRegister = () => {
    clearError();
    setLoginError('');
    router.push('/(auth)/register');
  };

  const errorMsg = loginError || error;

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={24}
      backgroundColor={theme.background?.val}
    >
      <Text fontSize={32} fontWeight="bold" color={theme.color?.val} marginBottom={24}>
        Login
      </Text>
      {errorMsg && (
        <YStack
          backgroundColor={theme.red10?.val}
          borderRadius={10}
          paddingVertical={10}
          paddingHorizontal={16}
          marginBottom={8}
          alignItems="center"
          maxWidth={320}
        >
          <Text color={theme.red1?.val} fontWeight="bold" fontSize={15}>
            {getAuthErrorMessage(errorMsg)}
          </Text>
        </YStack>
      )}
      <YStack width={320} gap={12}>
        <Controller
          control={control}
          name="email"
          rules={{ required: 'Email obbligatoria' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              backgroundColor={theme.color2?.val}
              color={theme.color?.val}
              borderColor={theme.color10?.val}
              borderWidth={1}
              borderRadius={10}
              paddingVertical={12}
              paddingHorizontal={16}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.email && <Text color={theme.red10?.val} fontSize={13}>{errors.email.message as string}</Text>}
        <Controller
          control={control}
          name="password"
          rules={{ required: 'Password obbligatoria' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Password"
              secureTextEntry
              backgroundColor={theme.color2?.val}
              color={theme.color?.val}
              borderColor={theme.color10?.val}
              borderWidth={1}
              borderRadius={10}
              paddingVertical={12}
              paddingHorizontal={16}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.password && <Text color={theme.red10?.val} fontSize={13}>{errors.password.message as string}</Text>}
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          width={"100%"}
          backgroundColor={theme.accent10?.val}
          color={theme.background?.val}
          borderRadius={10}
          fontWeight="bold"
          fontSize={16}
          paddingVertical={14}
        >
          {loading ? <Spinner color={theme.color?.val} /> : 'Login'}
        </Button>
      </YStack>
      <Text marginTop={32} color={theme.color?.val} fontSize={16}>
        Non hai un account?{' '}
        <Text color={theme.blue10?.val} fontWeight="bold" onPress={handleGoToRegister}>
          Registrati
        </Text>
      </Text>
    </YStack>
  );
}
