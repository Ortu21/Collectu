import { useState, useEffect } from "react";
import { YStack, Input, Button, Text, Spinner, useTheme, Card } from "tamagui";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { getAuthErrorMessage } from "../../utils/authErrorMessages";

export default function Login() {
  const [loginError, setLoginError] = useState("");
  const { login, error, loading, user, clearError } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    return () => {
      clearError();
      setLoginError("");
    };
  }, []);

  useEffect(() => {
    if (!loading && user) {
      clearError();
      setLoginError("");
      router.replace("/(tabs)/collectibles");
    }
  }, [user, loading, router, clearError]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoginError("");
    clearError();
    try {
      await login(data.email, data.password, false);
    } catch (e) {
      setLoginError(error || "Login failed");
    }
  };

  const handleGoToRegister = () => {
    clearError();
    setLoginError("");
    router.push("/(auth)/register");
  };

  const errorMsg = loginError || error;

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor={theme.background?.val}>
      <Card
        elevate
        bordered
        backgroundColor={theme.color2?.val}
        borderRadius={18}
        padding={32}
        maxWidth={380}
        width="90%"
        shadowColor={theme.shadow1 ?? 'rgba(0,0,0,0.08)'}
        shadowRadius={18}
        shadowOpacity={0.12}
        shadowOffset={{ width: 0, height: 4 }}
        alignItems="center"
      >
        <Text fontSize={30} fontWeight="bold" color={theme.color?.val} marginBottom={18}>
          Login
        </Text>
        {errorMsg && (
          <YStack
            backgroundColor={theme.red10?.val}
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={16}
            marginBottom={10}
            alignItems="center"
            maxWidth={320}
          >
            <Text color={theme.red1?.val} fontWeight="bold" fontSize={15}>
              {getAuthErrorMessage(errorMsg)}
            </Text>
          </YStack>
        )}
        <YStack width="100%" gap={14}>
          <Controller
            control={control}
            name="email"
            rules={{ required: "Email obbligatoria" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                backgroundColor={theme.background?.val}
                color={theme.color?.val}
                borderColor={theme.color10?.val}
                borderWidth={1}
                borderRadius={12}
                paddingVertical={14}
                paddingHorizontal={18}
                fontSize={16}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.email && (
            <Text color={theme.red10?.val} fontSize={13}>
              {errors.email.message as string}
            </Text>
          )}
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password obbligatoria" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Password"
                secureTextEntry
                backgroundColor={theme.background?.val}
                color={theme.color?.val}
                borderColor={theme.color10?.val}
                borderWidth={1}
                borderRadius={12}
                paddingVertical={14}
                paddingHorizontal={18}
                fontSize={16}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.password && (
            <Text color={theme.red10?.val} fontSize={13}>
              {errors.password.message as string}
            </Text>
          )}
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            width={"100%"}
            backgroundColor={theme.accent10?.val}
            color={theme.background?.val}
            borderRadius={12}
            fontWeight="bold"
            fontSize={17}
            paddingVertical={16}
            marginTop={8}
          >
            {loading ? <Spinner color={theme.color?.val} /> : "Login"}
          </Button>
        </YStack>
        <Text marginTop={28} color={theme.color?.val} fontSize={16}>
          Non hai un account?{' '}
          <Text
            color={theme.blue10?.val}
            fontWeight="bold"
            onPress={handleGoToRegister}
            textDecorationLine="underline"
            cursor="pointer"
            hoverStyle={{ opacity: 0.8 }}
          >
            Registrati
          </Text>
        </Text>
      </Card>
    </YStack>
  );
}
