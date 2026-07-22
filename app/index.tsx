import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Index() {
  const router = useRouter();

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1200 });

    const timer = setTimeout(() => {
      router.replace("../(auth)/onboarding");
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  const animatedName = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: opacity.value }],
    };
  });

  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Animated.Text
        entering={FadeIn.duration(600)}
        className="text-sm opacity-60 mb-5 text-foreground font-sans text-center"
      >
        {"</> loading Aptus..."}
      </Animated.Text>

      <Animated.Text
        entering={FadeInUp.delay(600).duration(1000)}
        className="text-4xl font-sans-medium text-foreground tracking-widest text-center"
      >
        Josué Cazares
      </Animated.Text>

      <Animated.Text
        entering={FadeIn.delay(1500).duration(800)}
        className="mt-2.5 text-base opacity-70 text-foreground font-sans text-center"
      >
        Mobile & Web Developer
      </Animated.Text>
    </View>
  );
}