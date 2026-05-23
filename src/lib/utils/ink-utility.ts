import { convertInkText } from "@drincs/pixi-vn-ink";

async function getInkText() {
    const files = import.meta.glob<string>("../ink/*.ink", { eager: true, import: "default" });
    return await Promise.all(
        Object.values(files).map(async (importFile) => {
            return importFile;
        }),
    );
}

export async function getInkToJson() {
    const fileEntries = await getInkText();
    return await Promise.all(fileEntries.map((data) => convertInkText(data)));
}
