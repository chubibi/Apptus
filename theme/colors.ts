/**
 * Colores de la aplicación — Aptus
 *
 * Fuente de verdad para uso en JS (StatusBar, navigation themes, etc.)
 * Los tokens CSS custom properties están en global.css
 *
 * Principios UI/UX aplicados:
 * - Sin blanco puro (#FFF) ni negro puro (#000) como fondos
 * - Fondos ligeramente tinted para reducir fatiga visual
 * - Acentos lime solo en CTA/badges, nunca en grandes superficies
 * - Dark mode con fondos desaturados para lectura nocturna cómoda
 */

export const colors = {
    light: {
        background: "#F8F9FC",
        surface: "#FFFFFF",
        surfaceElevated: "#F3F4F8",

        foreground: "#171725",
        foregroundSecondary: "#6B7280",
        foregroundMuted: "#9CA3AF",

        primary: "#040240",
        primaryForeground: "#F8F9FC",
        accent: "#BFF205",
        accentForeground: "#171725",

        border: "#E5E7EB",
        ring: "#040240",

        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
    },

    dark: {
        background: "#0F0F14",
        surface: "#1A1A24",
        surfaceElevated: "#242432",

        foreground: "#EDEFF3",
        foregroundSecondary: "#9CA3AF",
        foregroundMuted: "#4B5563",

        primary: "#7873FF",
        primaryForeground: "#0F0F14",
        accent: "#BFF205",
        accentForeground: "#0F0F14",

        border: "#2D2D3A",
        ring: "#7873FF",

        success: "#34D399",
        warning: "#FBBF24",
        error: "#F87171",
        info: "#60A5FA",
    },

    // Colores raw de marca (sin variante por tema)
    brand: {
        deepBlue: "#040240",
        lime: "#BFF205",
        limeLight: "#D7F205",
        olive: "#7D8C0B",
    },
}