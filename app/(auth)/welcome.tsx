import BottomModalSheet from "@/components/ui/BottomModalSheet"; // Ajusta la ruta
import MainView from "@/components/ui/MainView";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function WelcomeScreen() {
    // Usamos la ref para controlar el modal
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const handlePresentModal = () => {
        bottomSheetModalRef.current?.present();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <MainView>
                    <View className="flex p-4">
                        <Text className="text-3xl font-sans-medium text-foreground dark:text-foreground-dark">
                            Bienvenido
                        </Text>
                        <Text className="text-base font-sans mt-5 leading-7 tracking-tight text-foreground-secondary dark:text-foreground-secondary-dark">
                            Lo que verás a continuación es mi experiencia como desarrollador. Por el momento toda la información es mocked o hardcodeada para fines demostrativos.
                        </Text>

                        <View className="flex justify-center my-12">
                            <View className="flex items-start ml-4">
                                <Image
                                    source={require("@/assets/images/icons/android.png")}
                                    className="w-40 h-40"
                                    resizeMode="contain"
                                />
                            </View>
                            <View className="flex items-end mr-4">
                                <Image
                                    source={require("@/assets/images/icons/apple.png")}
                                    className="w-40 h-40"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        {/* footer */}
                        <View className="flex mt-10">
                            <Pressable
                                onPress={handlePresentModal}
                                className="bg-primary dark:bg-primary-dark p-4 rounded-full active:opacity-80"
                            >
                                <Text className="text-white dark:text-white text-center font-sans-bold">
                                    ¡Entendido, sigamos!
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Componente del Modal */}
                    <BottomModalSheet ref={bottomSheetModalRef} />
                </MainView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}