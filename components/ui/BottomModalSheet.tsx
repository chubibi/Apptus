import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { router } from "expo-router";
import { BellIcon, CameraIcon, LocationEditIcon } from "lucide-react-native";
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    ImageBackground,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type PermissionKey = "camera" | "location" | "notifications";

interface PermissionItem {
    key: PermissionKey;
    icon: React.ReactNode;
    title: string;
    description: string;
    granted: boolean;
    loading: boolean;
}

export type Ref = BottomSheetModal;

interface PermissionRowProps {
    item: PermissionItem;
    onRequest: (key: PermissionKey) => void;
}

const PermissionRow: React.FC<PermissionRowProps> = ({ item, onRequest }) => (
    <View className="flex-row items-center py-4 border-b border-white/10">
        <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
            style={{
                backgroundColor: item.granted
                    ? "rgba(74, 222, 128, 0.15)"
                    : "rgba(255,255,255,0.08)",
            }}
        >
            <Text style={{ fontSize: 22 }}>{item.icon}</Text>
        </View>

        <View className="flex-1">
            <Text
                className="font-semibold text-base"
                style={{ color: "#F5F5F5", fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium" }}
            >
                {item.title}
            </Text>
            <Text
                className="text-xs mt-0.5"
                style={{ color: "rgba(255,255,255,0.45)" }}
            >
                {item.description}
            </Text>
        </View>

        {item.granted ? (
            <View className="flex-row items-center gap-1 px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(74, 222, 128, 0.18)" }}>
                <Text style={{ color: "#4ADE80", fontSize: 13, fontWeight: "600" }}>✓ Activo</Text>
            </View>
        ) : (
            <TouchableOpacity
                onPress={() => onRequest(item.key)}
                disabled={item.loading}
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: item.loading ? "rgba(255,255,255,0.1)" : "#4ADE80" }}
                activeOpacity={0.75}
            >
                <Text
                    style={{
                        color: item.loading ? "rgba(255,255,255,0.4)" : "#0D1117",
                        fontSize: 13,
                        fontWeight: "700",
                    }}
                >
                    {item.loading ? "…" : "Permitir"}
                </Text>
            </TouchableOpacity>
        )}
    </View>
);

const BottomModalSheet = forwardRef<Ref>((_, ref) => {
    const snapPoints = useMemo(() => ["72%"], []);

    const [permissions, setPermissions] = useState<PermissionItem[]>([
        {
            key: "camera",
            icon: <CameraIcon size={24} color="#4ADE80" />,
            title: "Cámara",
            description: "Aptus necesita tu cámara.",
            granted: false,
            loading: false,
        },
        {
            key: "location",
            icon: <LocationEditIcon size={24} color="#4ADE80" />,
            title: "Ubicación",
            description: "Aptus necesita tu ubicación.",
            granted: false,
            loading: false,
        },
        {
            key: "notifications",
            icon: <BellIcon size={24} color="#4ADE80" />,
            title: "Notificaciones",
            description: "Aptus necesita tus notificaciones.",
            granted: false,
            loading: false,
        },
    ]);

    const updatePermission = (
        key: PermissionKey,
        patch: Partial<PermissionItem>
    ) =>
        setPermissions((prev) =>
            prev.map((p) => (p.key === key ? { ...p, ...patch } : p))
        );

    const requestCamera = useCallback(async () => {
        updatePermission("camera", { loading: true });
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            updatePermission("camera", {
                granted: status === "granted",
                loading: false,
            });
            if (status !== "granted") {
                Alert.alert(
                    "Permiso denegado",
                    "Activa la cámara desde la configuración del dispositivo."
                );
            }
        } catch {
            updatePermission("camera", { loading: false });
        }
    }, []);

    const requestLocation = useCallback(async () => {
        updatePermission("location", { loading: true });
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            updatePermission("location", {
                granted: status === "granted",
                loading: false,
            });
            if (status !== "granted") {
                Alert.alert(
                    "Permiso denegado",
                    "Activa la ubicación desde la configuración del dispositivo."
                );
            }
        } catch {
            updatePermission("location", { loading: false });
        }
    }, []);

    const requestNotifications = useCallback(async () => {
        updatePermission("notifications", { loading: true });
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            updatePermission("notifications", {
                granted: status === "granted",
                loading: false,
            });
            if (status !== "granted") {
                Alert.alert(
                    "Permiso denegado",
                    "Activa las notificaciones desde la configuración del dispositivo."
                );
            }
        } catch {
            updatePermission("notifications", { loading: false });
        }
    }, []);

    const handleRequest = useCallback(
        (key: PermissionKey) => {
            if (key === "camera") requestCamera();
            else if (key === "location") requestLocation();
            else requestNotifications();
        },
        [requestCamera, requestLocation, requestNotifications]
    );

    const allGranted = permissions.every((p) => p.granted);

    const handleAllowAll = useCallback(async () => {
        await Promise.all([
            requestCamera(),
            requestLocation(),
            requestNotifications(),
        ]);
    }, [requestCamera, requestLocation, requestNotifications]);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.6}
            />
        ),
        []
    );

    useEffect(() => {
        if (allGranted) {
            router.push("/(auth)/otp");
        }
    }, [allGranted]);

    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            handleComponent={() => null}
            backgroundStyle={{ backgroundColor: "#0D1117", borderRadius: 28 }}
        >
            <BottomSheetView style={{ flex: 1, borderRadius: 28, overflow: "hidden" }}>
                <ImageBackground
                    source={require("../../assets/images/permission.png")}
                    style={{ width: "100%", height: 190 }}
                    resizeMode="cover"
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "transparent",
                            justifyContent: "space-between",
                            padding: 0,
                        }}
                    >
                        <View className="items-center pt-3">
                            <View
                                style={{
                                    width: 40,
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255,255,255,0.5)",
                                }}
                            />
                        </View>

                        <View
                            style={{
                                paddingHorizontal: 20,
                                paddingBottom: 20,
                                paddingTop: 40,
                                backgroundColor: "rgba(13,17,23,0.55)",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: 22,
                                    fontWeight: "700",
                                    letterSpacing: -0.5,
                                    fontFamily:
                                        Platform.OS === "ios"
                                            ? "SF Pro Display"
                                            : "sans-serif-medium",
                                }}
                            >
                                Permisos de la app
                            </Text>
                            <Text
                                style={{
                                    color: "rgba(255,255,255,0.6)",
                                    fontSize: 13,
                                    marginTop: 2,
                                }}
                            >
                                Necesitamos tu autorización para continuar
                            </Text>
                        </View>
                    </View>
                </ImageBackground>

                <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 4 }}>
                    {permissions.map((item) => (
                        <PermissionRow
                            key={item.key}
                            item={item}
                            onRequest={handleRequest}
                        />
                    ))}
                </View>

                <View style={{ paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12 }}>
                    {!allGranted ? (
                        <TouchableOpacity
                            onPress={handleAllowAll}
                            style={{
                                backgroundColor: "#4ADE80",
                                borderRadius: 16,
                                paddingVertical: 16,
                                alignItems: "center",
                            }}
                            activeOpacity={0.82}
                        >
                            <Text
                                style={{
                                    color: "#0D1117",
                                    fontWeight: "700",
                                    fontSize: 16,
                                    letterSpacing: -0.3,
                                }}
                            >
                                Permitir todo
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View
                            style={{
                                backgroundColor: "rgba(74,222,128,0.12)",
                                borderRadius: 16,
                                paddingVertical: 16,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#4ADE80", fontWeight: "700", fontSize: 16 }}>
                                ✓ Todo listo
                            </Text>
                        </View>
                    )}
                </View>

            </BottomSheetView>
        </BottomSheetModal>
    );
});

BottomModalSheet.displayName = "BottomModalSheet";

export default BottomModalSheet;