import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainView({ children }: { children: React.ReactNode }) {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 px-4 py-4">
                {children}
            </View>
        </SafeAreaView>
    );
}