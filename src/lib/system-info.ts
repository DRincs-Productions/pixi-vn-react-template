/**
 * Native system info — thin wrappers around Tauri commands exposed by
 * `src-tauri/src/system_info.rs`. Safe to call even when running outside
 * Tauri (web mode): functions resolve to `null` instead of throwing.
 *
 * These expose OS/distro and WebView engine details that browsers
 * deliberately don't surface to JS (to limit fingerprinting).
 */

import { invoke } from "@tauri-apps/api/core";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

export interface NativeSystemInfo {
    /** Specific OS/distro name (e.g. "Ubuntu", "Windows", "Mac OS"), not just the generic platform. */
    osType: string;
    osVersion: string;
    bitness: string;
    architecture: string;
}

interface RawSystemInfo {
    os_type: string;
    os_version: string;
    bitness: string;
    architecture: string;
}

async function call<T>(cmd: string): Promise<T | null> {
    if (!isTauri) return null;
    try {
        return await invoke<T>(cmd);
    } catch {
        return null;
    }
}

export namespace systemInfo {
    export async function getSystemInfo(): Promise<NativeSystemInfo | null> {
        const raw = await call<RawSystemInfo>("get_system_info");
        if (!raw) return null;
        return {
            osType: raw.os_type,
            osVersion: raw.os_version,
            bitness: raw.bitness,
            architecture: raw.architecture,
        };
    }

    /** Underlying WebView engine version (WebView2, WebKitGTK, WKWebView, Android System WebView). */
    export async function getWebviewVersion(): Promise<string | null> {
        return call<string>("get_webview_version");
    }
}
