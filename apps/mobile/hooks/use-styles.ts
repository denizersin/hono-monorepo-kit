import { TColors } from "@/constants/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useThemedColors } from "./use-theme-color";

interface Styles<P, T extends StyleSheet.NamedStyles<T>> {
    colors: TColors;
    styles: T;
    createDynamicStyles: (props: P) => T;
}

// P = props type, T = style type
export default function useStyles<P = void, T extends StyleSheet.NamedStyles<T> = any>(
    createStyle: (colors: TColors, props: P) => T,
    props?: P
): Styles<P, T> {
    const ThemedColors = useThemedColors();

    const styles = useMemo(
        () => createStyle(ThemedColors, props ?? ({} as P)),
        [ThemedColors, createStyle, Object.values(props ?? {}).join(',')]
    );

    function createDynamicStyles(props: P) {
        return createStyle(ThemedColors, props)
    }

    return {
        colors: ThemedColors,
        styles,
        createDynamicStyles
    };
}