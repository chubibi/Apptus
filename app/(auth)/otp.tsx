import MainView from "@/components/ui/MainView";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from "react-native-reanimated";

export default function OtpScreen() {
    const router = useRouter();
    const [expectedOtp, setExpectedOtp] = useState<string>("");
    const [inputOtp, setInputOtp] = useState<string[]>(new Array(4).fill(""));
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    // Refs for input navigation
    const ref1 = useRef<TextInput>(null);
    const ref2 = useRef<TextInput>(null);
    const ref3 = useRef<TextInput>(null);
    const ref4 = useRef<TextInput>(null);
    const refs = [ref1, ref2, ref3, ref4];

    // Animation values
    const shakeOffset = useSharedValue(0);
    const successScale = useSharedValue(0);

    const generateNewOtp = () => {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setExpectedOtp(code);
    };

    useEffect(() => {
        generateNewOtp();
        // Autofocus the first input on mount
        setTimeout(() => {
            ref1.current?.focus();
        }, 150);
    }, []);

    const handleChangeText = (text: string, index: number) => {
        const cleanText = text.replace(/[^0-9]/g, "");
        if (cleanText === "") {
            const newOtp = [...inputOtp];
            newOtp[index] = "";
            setInputOtp(newOtp);
            return;
        }

        const digit = cleanText.substring(cleanText.length - 1);
        const newOtp = [...inputOtp];
        newOtp[index] = digit;
        setInputOtp(newOtp);

        // Auto-focus next input
        if (index < 3) {
            refs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace") {
            if (inputOtp[index] === "" && index > 0) {
                const newOtp = [...inputOtp];
                newOtp[index - 1] = "";
                setInputOtp(newOtp);
                refs[index - 1].current?.focus();
            }
        }
    };

    const resetOtp = () => {
        setInputOtp(new Array(4).fill(""));
        generateNewOtp();
        setTimeout(() => {
            ref1.current?.focus();
        }, 100);
    };

    // Listen to changes in inputOtp to automatically validate when all are filled
    useEffect(() => {
        const code = inputOtp.join("");
        if (code.length === 4) {
            if (code === expectedOtp) {
                setIsSuccess(true);
                successScale.value = withSpring(1);
                setTimeout(() => {
                    router.replace("/(auth)/username");
                }, 1500);
            } else {
                // Shake animation
                shakeOffset.value = withSequence(
                    withTiming(-12, { duration: 60 }),
                    withTiming(12, { duration: 60 }),
                    withTiming(-8, { duration: 60 }),
                    withTiming(8, { duration: 60 }),
                    withTiming(0, { duration: 60 })
                );
                // Clear and regenerate after animation
                setTimeout(() => {
                    resetOtp();
                }, 400);
            }
        }
    }, [inputOtp]);

    // Animated Styles
    const animatedShakeStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shakeOffset.value }],
        };
    });

    const animatedSuccessStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: successScale.value }],
            opacity: successScale.value,
        };
    });

    return (
        <MainView>
            {/* Header / Volver */}
            <View className="flex-row items-center justify-between">
                <Pressable
                    onPress={() => router.back()}
                    className="flex-row items-center gap-2 py-2 active:opacity-70"
                >
                    <ArrowLeft size={24} color={colors.dark.primary} />
                    <Text className="text-base font-sans-medium text-foreground dark:text-foreground-dark">
                        Volver
                    </Text>
                </Pressable>
            </View>

            {/* Content */}
            <View className="mt-10 gap-2">
                <Text className="text-3xl font-sans-medium text-foreground dark:text-foreground-dark">
                    Verificación de acceso
                </Text>
                <Text className="text-base font-sans text-foreground-secondary dark:text-[#BFF205] leading-6">
                    Te enviamos un código de 4 dígitos
                </Text>
            </View>

            {/* Container for validation state */}
            <View className="h-40 justify-center mt-10">
                {!isSuccess ? (
                    <Animated.View
                        style={[animatedShakeStyle]}
                        className="flex-row justify-between items-center px-4"
                    >
                        {inputOtp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={refs[index]}
                                placeholder="•"
                                placeholderTextColor="rgba(156, 163, 175, 0.4)"
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleChangeText(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                selectTextOnFocus
                                className="w-16 h-18 rounded-2xl border-2 border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-center text-3xl font-sans-bold text-foreground dark:text-foreground-dark focus:border-primary dark:focus:border-primary-dark"
                            />
                        ))}
                    </Animated.View>
                ) : (
                    <Animated.View
                        style={[animatedSuccessStyle]}
                        className="items-center justify-center gap-3"
                    >
                        <View className="w-20 h-20 rounded-full bg-success/20 items-center justify-center border-2 border-success">
                            <Check className="text-success" size={40} strokeWidth={3} />
                        </View>
                        <Text className="text-lg font-sans-medium text-success text-center">
                            Código validado con éxito
                        </Text>
                    </Animated.View>
                )}
            </View>

            {/* Demo Helper & Resend Code */}
            {!isSuccess && (
                <View className="mt-6 gap-6">
                    <View className="bg-surface-elevated dark:bg-surface-elevated-dark p-4 rounded-2xl border border-border/10">
                        <Text className="text-center text-sm font-sans text-foreground-secondary dark:text-foreground-secondary-dark">
                            Modo Demo: Ingresa el siguiente código de acceso
                        </Text>
                        <Text className="text-center text-2xl font-sans-bold text-primary dark:text-primary-dark mt-2 tracking-wider">
                            {expectedOtp}
                        </Text>
                    </View>

                    <Pressable
                        onPress={resetOtp}
                        className="flex-row items-center justify-center py-3 rounded-full bg-transparent border border-border dark:border-border-dark active:bg-foreground/5"
                    >
                        <Text className="text-center text-base font-sans-medium text-foreground dark:text-foreground-dark">
                            Reenviar código
                        </Text>
                    </Pressable>
                </View>
            )}
        </MainView>
    );
}