import MainView from "@/components/ui/MainView";
import { ONBOARDING_SLIDES } from "@/constants/onboarding";
import { useRouter } from "expo-router";
import { CornerDownRight } from 'lucide-react-native';
import { useRef, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesRef = useRef<FlatList>(null);

    const scrollToNext = () => {
        if (currentIndex < ONBOARDING_SLIDES.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push("/(auth)/welcome");
        }
    };

    const skipOnboarding = () => {
        router.push("/(auth)/welcome");
    };

    return (
        <MainView>
            <View className="flex-1 justify-between">
                <View className="flex items-end mx-4 mt-2">
                    <Pressable onPress={skipOnboarding}>
                        <Text className="font-sans-medium font-bold text-base text-foreground dark:text-foreground-dark m-2">Saltar</Text>
                    </Pressable>
                </View>

                {/* Slider Content */}
                <View className="flex-1">
                    <FlatList
                        ref={slidesRef}
                        data={ONBOARDING_SLIDES}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / width);
                            setCurrentIndex(index);
                        }}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={{ width: width - 32 }} className="flex-1 justify-center px-4">
                                <View className="flex items-center justify-center mb-10">
                                    <Image
                                        source={item.image}
                                        className="w-full h-88"
                                        resizeMode="contain"
                                    />
                                </View>
                                <View className="flex">
                                    <Text className="text-4xl font-sans-medium text-foreground dark:text-foreground-dark">
                                        {item.title}
                                    </Text>
                                    <Text className="text-lg mt-4 font-sans text-foreground-secondary dark:text-foreground-secondary-dark leading-7">
                                        {item.description}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/* Footer */}
                <View className="flex-row px-4 mb-6 justify-between items-center">
                    <View className="flex-row gap-2">
                        {ONBOARDING_SLIDES.map((_, index) => (
                            <View
                                key={index}
                                className={`h-2 rounded-full ${currentIndex === index
                                    ? "w-8 bg-primary dark:bg-primary-dark"
                                    : "w-2.5 bg-border dark:bg-border-dark"
                                    }`}
                            />
                        ))}
                    </View>
                    <Pressable className="bg-primary px-4 py-2 h-20 w-20 rounded-full items-center justify-center"
                        onPress={scrollToNext}>
                        <CornerDownRight width={28} height={28} color={"#BFF205"} />
                    </Pressable>
                </View>
            </View>
        </MainView>
    );
}