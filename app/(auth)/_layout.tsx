import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="onboarding"
        >
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="username" />
        </Stack>
    );
}
