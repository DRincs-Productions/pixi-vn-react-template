import packageJson from "@/../package.json";
import { useTranslation } from "react-i18next";

export function About() {
    const { t } = useTranslation(["ui"]);

    return (
        <div className="flex flex-col gap-1 text-sm pl-4">
            <div className="flex gap-2">
                <span className="font-medium text-muted-foreground">{t("name")}:</span>
                <span>{packageJson.name}</span>
            </div>
            <div className="flex gap-2">
                <span className="font-medium text-muted-foreground">{t("version")}:</span>
                <span>v{packageJson.version}</span>
            </div>
            <div className="flex gap-2">
                <span className="font-medium text-muted-foreground">{t("engine")}:</span>
                <span>
                    {t("powered_by")}{" "}
                    <a
                        href="https://pixi-vn.web.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-foreground"
                    >
                        Pixi&apos;VN
                    </a>
                </span>
            </div>
        </div>
    );
}
