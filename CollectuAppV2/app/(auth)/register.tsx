import { useState, useEffect } from 'react';
import { YStack, Input, Button, Text, Spinner } from 'tamagui';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const { register, loading, error, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !userName) {
      setRegisterError('Tutti i campi sono obbligatori');
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError('Le password non coincidono');
      return;
    }
    if (password.length < 6) {
      setRegisterError('La password deve essere di almeno 6 caratteri');
      return;
    }
    setRegisterError('');
    try {
      await register(email, password, userName);
    } catch (e) {
      setRegisterError(error || 'Registrazione fallita');
    }
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space>
      <Text fontSize={28} fontWeight="bold">Registrati</Text>
      {(registerError || error) && <Text color="red">{registerError || error}</Text>}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        width={250}
      />
      <Input
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
        autoCapitalize="none"
        width={250}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        width={250}
      />
      <Input
        placeholder="Conferma Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        width={250}
      />
      <Button onPress={handleRegister} disabled={loading} width={250}>
        {loading ? <Spinner color="$color" /> : 'Registrati'}
      </Button>
      <Text marginTop="$2">Hai già un account? <Text color="$blue10" onPress={() => router.push('/(auth)/login')}>Accedi</Text></Text>
    </YStack>
  );
}
