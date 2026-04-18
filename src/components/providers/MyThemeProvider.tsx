import { createContext, useContext, useEffect, useState } from "react";

type Props = {
    children: React.ReactNode;
};
type SolidColorType = "black" | "white";

const ColorContext = createContext<{
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    solidColor: SolidColorType;
    setSolidColor: (color: SolidColorType) => void;
}>({
    primaryColor: "",
    setPrimaryColor: () => {},
    solidColor: "white",
    setSolidColor: () => {},
});

export function useEditColorProvider() {
    const context = useContext(ColorContext);
    if (context === undefined) {
        throw new Error("usePrimaryColorProvider must be used within a PrimaryColorProvider");
    }
    return context;
}

/**
 * @deprecated Legacy compatibility provider retained only for `useEditColorProvider`.
 * The app now relies on the shadcn/tailwind theme system (`ThemeProvider`).
 * New code should avoid this provider and use design tokens/CSS variables directly.
 * Planned removal: next major version.
 */
export default function MyThemeProvider({ children }: Props) {
    const [primaryColor, setPrimaryColor] = useState(
        localStorage.getItem("primaryColor") || "#1c73ff",
    );
    const [solidColor, setSolidColor] = useState<SolidColorType>(
        (localStorage.getItem("solidColor") as SolidColorType) || "white",
    );

    useEffect(() => {
        localStorage.setItem("primaryColor", primaryColor);
        localStorage.setItem("solidColor", solidColor);
    }, [primaryColor, solidColor]);

    return (
        <ColorContext.Provider
            value={{
                primaryColor: primaryColor,
                setPrimaryColor: setPrimaryColor,
                solidColor: solidColor,
                setSolidColor: setSolidColor,
            }}
        >
            {children}
        </ColorContext.Provider>
    );
}
