import packageJson from "@/../package.json";
import { useTranslation } from "react-i18next";

export function About() {
    const { t } = useTranslation(["ui"]);

    return (
        <>
            <p className="text-sm font-semibold">{packageJson.name}</p>
            <p className="text-sm text-muted-foreground">v{packageJson.version}</p>
            <p className="text-sm text-muted-foreground">
                {t("generated_with_engine", { engine: "Pixi'VN" })}
            </p>
        </>
    );
}
