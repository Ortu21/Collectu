import { useState, useEffect } from 'react';
import { YStack, Input, Button, Text, Spinner } from 'tamagui';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login, error, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError('Email and password are required');
      return;
    }
    setLoginError('');
    try {
      await login(email, password, rememberMe);
    } catch (e) {
      setLoginError(error || 'Login failed');
    }
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space>
      <Text fontSize={28} fontWeight="bold">Login</Text>
      {(loginError || error) && <Text color="red">{loginError || error}</Text>}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        width={250}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        width={250}
      />
      {/* Qui puoi aggiungere un toggle per Remember Me se vuoi */}
      <Button onPress={handleLogin} disabled={loading} width={250}>
        {loading ? <Spinner color="$color" /> : 'Login'}
      </Button>
      <Text marginTop="$2">Non hai un account? <Text color="$blue10" onPress={() => router.push('/(auth)/register')}>Registrati</Text></Text>
    </YStack>
  );
}
