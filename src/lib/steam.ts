/**
 * Steam utility — thin wrappers around Tauri commands exposed by the
 * `steam` Cargo feature. All functions are safe to call even when:
 *   - the app is running outside Tauri (web mode)
 *   - Steam is not running
 *   - the `steam` feature was not compiled in
 * In all those cases the functions return sensible defaults (null / false / 0)
 * without throwing.
 *
 * Enable Steam in Rust:
 *   src-tauri/Cargo.toml → default = ["steam"]   (or pass --features steam)
 *
 * Typical usage:
 *   import { steam } from "@/lib/steam";
 *
 *   const name = await steam.getPlayerName();          // "Alice" | null
 *   await steam.unlockAchievement("ACH_COMPLETE_CH1"); // fire & forget
 *   await steam.openOverlay("achievements");
 */

import { invoke } from "@tauri-apps/api/core";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

/** Dialogs supported by the Steam overlay. */
export type SteamOverlayDialog =
    | "achievements"
    | "community"
    | "friends"
    | "players"
    | "settings"
    | "officialgamegroup"
    | "stats";

async function call<T>(cmd: string, args?: Record<string, unknown>): Promise<T | null> {
    if (!isTauri) return null;
    try {
        return await invoke<T>(cmd, args);
    } catch {
        return null;
    }
}

// ── API ───────────────────────────────────────────────────────────────────────

export namespace steam {
    /** `true` when Steam was initialised successfully (Steam client running). */
    export async function isAvailable(): Promise<boolean> {
        return (await call<boolean>("steam_is_available")) ?? false;
    }

    /** Steam display name of the logged-in user. */
    export async function getPlayerName(): Promise<string | null> {
        return call<string>("steam_get_player_name");
    }

    /** Numeric App ID of the running application. */
    export async function getAppId(): Promise<number | null> {
        return call<number>("steam_get_app_id");
    }

    // ── Achievements ──────────────────────────────────────────────────────────

    /**
     * Unlock an achievement and immediately persist it.
     * `id` must match the API Name in Steamworks Partner.
     */
    export async function unlockAchievement(id: string): Promise<void> {
        await call("steam_unlock_achievement", { achievementId: id });
    }

    /**
     * Returns `true` if the user has already unlocked the achievement.
     * Reliable only after the first few seconds of launch (stats are fetched
     * automatically at startup).
     */
    export async function isAchievementUnlocked(id: string): Promise<boolean> {
        return (await call<boolean>("steam_is_achievement_unlocked", { achievementId: id })) ?? false;
    }

    /** Reset an achievement — intended for development / testing only. */
    export async function clearAchievement(id: string): Promise<void> {
        await call("steam_clear_achievement", { achievementId: id });
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    /** Set an integer stat. Remember to call `storeStats()` afterwards. */
    export async function setStatInt(name: string, value: number): Promise<void> {
        await call("steam_set_stat_int", { name, value: Math.trunc(value) });
    }

    /** Read an integer stat (returns `0` on error). */
    export async function getStatInt(name: string): Promise<number> {
        return (await call<number>("steam_get_stat_int", { name })) ?? 0;
    }

    /** Set a float stat. Remember to call `storeStats()` afterwards. */
    export async function setStatFloat(name: string, value: number): Promise<void> {
        await call("steam_set_stat_float", { name, value });
    }

    /** Read a float stat (returns `0` on error). */
    export async function getStatFloat(name: string): Promise<number> {
        return (await call<number>("steam_get_stat_float", { name })) ?? 0;
    }

    /**
     * Commit pending stat changes to Steam servers.
     * `unlockAchievement` / `clearAchievement` already call this automatically;
     * you only need this when using `setStatInt` / `setStatFloat` directly.
     */
    export async function storeStats(): Promise<void> {
        await call("steam_store_stats");
    }

    // ── DLC ───────────────────────────────────────────────────────────────────

    /** `true` if the user owns and has installed the DLC with the given App ID. */
    export async function isDlcInstalled(appId: number): Promise<boolean> {
        return (await call<boolean>("steam_is_dlc_installed", { appId })) ?? false;
    }

    // ── Overlay ───────────────────────────────────────────────────────────────

    /**
     * Open the Steam overlay to a specific dialog.
     *
     * Common values: "achievements", "friends", "community", "stats",
     *                "settings", "officialgamegroup", "players"
     */
    export async function openOverlay(dialog: SteamOverlayDialog): Promise<void> {
        await call("steam_open_overlay", { dialog });
    }

    /**
     * Open the Steam store page for this game.
     * Pass a different `appId` to open another game's page.
     */
    export async function openStore(appId?: number): Promise<void> {
        await call("steam_open_store", { appId: appId ?? null });
    }
}
