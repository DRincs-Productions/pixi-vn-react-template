import { getCurrentWindow } from "@tauri-apps/api/window";

const TAURI_FULLSCREEN_KEY = "tauri_fullscreen";

export function saveTauriFullscreenPreference(value: boolean) {
    localStorage.setItem(TAURI_FULLSCREEN_KEY, value.toString());
}

export async function restoreTauriFullscreen() {
    if (!window.__TAURI__) return;
    const saved = localStorage.getItem(TAURI_FULLSCREEN_KEY);
    if (saved === "true") {
        getCurrentWindow().setFullscreen(true);
    }
}
