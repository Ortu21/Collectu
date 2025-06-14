import { useState, useEffect } from 'react';
import { YStack, Button, Text, Spinner, useTheme, Input } from 'tamagui';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { getAuthErrorMessage } from '../../utils/authErrorMessages';

export default function Register() {
  const [registerError, setRegisterError] = useState('');
  const { register, loading, error, user, clearError } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    // Pulisci errori quando il componente viene smontato o cambia route
    return () => {
      clearError();
      setRegisterError('');
    };
  }, []);

  useEffect(() => {
    if (!loading && user) {
      clearError();
      setRegisterError('');
      router.replace('/');
    }
  }, [user, loading, router, clearError]);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', userName: '', password: '', confirmPassword: '' }
  });

  const onSubmit = async (data: { email: string; userName: string; password: string; confirmPassword: string }) => {
    setRegisterError('');
    clearError();
    if (!data.email || !data.userName || !data.password || !data.confirmPassword) {
      setRegisterError('Tutti i campi sono obbligatori');
      return;
    }
    if (data.password !== data.confirmPassword) {
      setRegisterError('Le password non coincidono');
      return;
    }
    if (data.password.length < 6) {
      setRegisterError('La password deve essere di almeno 6 caratteri');
      return;
    }
    try {
      await register(data.email, data.password, data.userName);
    } catch (e) {
      setRegisterError(error || 'Registrazione fallita');
    }
  };

  const handleGoToLogin = () => {
    clearError();
    setRegisterError('');
    router.push('/(auth)/login');
  };

  const errorMsg = registerError || error;

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={24}
      backgroundColor={theme.background?.val}
    >
      <Text fontSize={32} fontWeight="bold" color={theme.color?.val} marginBottom={24}>
        Registrati
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
          name="userName"
          rules={{ required: 'Username obbligatorio' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Username"
              autoCapitalize="none"
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
        {errors.userName && <Text color={theme.red10?.val} fontSize={13}>{errors.userName.message as string}</Text>}
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
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: 'Conferma password obbligatoria' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Conferma Password"
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
        {errors.confirmPassword && <Text color={theme.red10?.val} fontSize={13}>{errors.confirmPassword.message as string}</Text>}
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
          {loading ? <Spinner color={theme.color?.val} /> : 'Registrati'}
        </Button>
      </YStack>
      <Text marginTop={32} color={theme.color?.val} fontSize={16}>
        Hai già un account?{' '}
        <Text color={theme.blue10?.val} fontWeight="bold" onPress={handleGoToLogin}>
          Accedi
        </Text>
      </Text>
    </YStack>
  );
}
