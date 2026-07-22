/**
 * Tipografía de la aplicación — Aptus
 *
 * Constantes de fuente para uso programático cuando no se puede usar Tailwind.
 * Las clases de Tailwind (font-sans, font-medium, font-light) se configuran
 * en tailwind.config.js.
 */

export const typography = {
    fonts: {
        regular: "Manrope",
        medium: "ManropeMedium",
        light: "ManropeLight",
    },

    sizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
    },

    lineHeights: {
        xs: 16,
        sm: 20,
        base: 24,
        lg: 28,
        xl: 28,
        "2xl": 32,
        "3xl": 36,
        "4xl": 40,
    },

    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
    },
} as const;

export type FontFamily = keyof typeof typography.fonts;
export type FontSize = keyof typeof typography.sizes;
