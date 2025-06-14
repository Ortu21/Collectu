import { Stack } from 'expo-router';
import { ThemeToggleButton } from '../../components/ThemeToggleButton';

export default function AuthLayout() {
    return (
        <>
            <ThemeToggleButton />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
            </Stack>
        </>
    );
}

