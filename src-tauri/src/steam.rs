use std::sync::Mutex;
use steamworks::{AppId, Client, OverlayToStoreFlag};
use tauri::State;

pub struct SteamClient {
    pub client: Mutex<Option<Client>>,
}

/// Try to initialise Steam. Returns `None` when Steam is not running or the
/// game is launched outside Steam (e.g. during CI builds).
///
/// A background thread is spawned to pump Steam callbacks every 100 ms so
/// that overlay notifications, stat uploads, and other async operations work.
pub fn try_init() -> Option<Client> {
    match Client::init() {
        Ok(client) => {
            // Client is Clone + Send + Sync in steamworks 0.13 — safe to move into a thread.
            let ticker = client.clone();
            std::thread::spawn(move || loop {
                ticker.run_callbacks();
                std::thread::sleep(std::time::Duration::from_millis(100));
            });

            eprintln!("[Steam] Initialised — App ID {}", client.utils().app_id().0);
            Some(client)
        }
        Err(e) => {
            eprintln!("[Steam] Not available: {e}");
            None
        }
    }
}

// ── Commands ──────────────────────────────────────────────────────────────────

/// Returns `true` when Steam was initialised successfully.
#[tauri::command]
pub fn steam_is_available(state: State<'_, SteamClient>) -> bool {
    state.client.lock().map_or(false, |g| g.is_some())
}

/// Steam display name of the current user (`null` when Steam unavailable).
#[tauri::command]
pub fn steam_get_player_name(state: State<'_, SteamClient>) -> Option<String> {
    state
        .client
        .lock()
        .ok()
        .and_then(|g| g.as_ref().map(|c| c.friends().name()))
}

/// Numeric Steam App ID of the running application.
#[tauri::command]
pub fn steam_get_app_id(state: State<'_, SteamClient>) -> Option<u32> {
    state
        .client
        .lock()
        .ok()
        .and_then(|g| g.as_ref().map(|c| c.utils().app_id().0))
}

// ── Achievements ──────────────────────────────────────────────────────────────

/// Unlock an achievement and persist it to Steam immediately.
///
/// `achievement_id` must match the API Name defined in Steamworks Partner.
#[tauri::command]
pub fn steam_unlock_achievement(
    state: State<'_, SteamClient>,
    achievement_id: String,
) -> Result<(), String> {
    let guard = state.client.lock().map_err(|e| e.to_string())?;
    let client = guard.as_ref().ok_or("Steam not available")?;
    let stats = client.user_stats();
    stats
        .achievement(&achievement_id)
        .set()
        .map_err(|_| format!("Achievement '{}' not found or stats not ready", achievement_id))?;
    stats
        .store_stats()
        .map_err(|_| "Failed to store stats".to_string())
}

/// Returns `true` if the current user has already unlocked the achievement.
///
/// Stats are fetched automatically when Steam initialises. Allow a few seconds
/// after launch before calling this for the most reliable result.
#[tauri::command]
pub fn steam_is_achievement_unlocked(
    state: State<'_, SteamClient>,
    achievement_id: String,
) -> Result<bool, String> {
    let guard = state.client.lock().map_err(|e| e.to_string())?;
    let client = guard.as_ref().ok_or("Steam not available")?;
    client
        .user_stats()
        .achievement(&achievement_id)
        .get()
        .map_err(|_| format!("Achievement '{}' not found or stats not ready", achievement_id))
}

/// Reset an achievement (useful during development / QA).
#[tauri::command]
pub fn steam_clear_achievement(
    state: State<'_, SteamClient>,
    achievement_id: String,
) -> Result<(), String> {
    let guard = state.client.lock().map_err(|e| e.to_string())?;
    let client = guard.as_ref().ok_or("Steam not available")?;
    let stats = client.user_stats();
    stats
        .achievement(&achievement_id)
        .clear()
        .map_err(|_| format!("Achievement '{}' not found or stats not ready", achievement_id))?;
    stats
        .store_stats()
        .map_err(|_| "Failed to store stats".to_string())
}

// ── Stats ─────────────────────────────────────────────────────────────────────

/// Set an integer stat. Call `steam_store_stats` to persist.
#[tauri::command]
pub fn steam_set_stat_int(
    state: State<'_, SteamClient>,
    name: String,
    value: i32,
) -> Result<(), String> {
    let guard = state.client.lock().map_err(|e| e.to_string())?;
    let client = guard.as_ref().ok_or("Steam not available")?;
    client
        .user_stats()
        .set_stat_i32(&name, value)
        .map_err(|_| format!("Failed to set stat '{}'", name))
}

/// Read an integer stat.
#[tauri::command]
pub fn steam_get_stat_int(
    state: State<'_, SteamClient>,
    name: String,
) -> Result<i32, String> {
    let guard = state.client.lock().map_err(|e| e.to_string())?;
    let client = guard.as_ref().ok_or("Steam not available")?;
    client
        .user_stats()
        .get_stat_i32(&name)
        .map_err(|_| format!("Failed to get stat '{}'", name))
}

/// Set a float stat. Call `steam_store_stats` to persist.
#[tauri::command]
pub fn steam_set_stat_float(
    state: State<'_, SteamClient>,
    name: String,
    value: f32,
) -> Result<(), String> {
    let guard = state.client.lock().map_err(|e| e.to_string())?;
    let client = guard.as_ref().ok_or("Steam not available")?;
    client
        .user_stats()
        .set_stat_f32(&name, value)
        .map_err(|_| format!("Failed to set stat '{}'", name))
}

/// Read a float stat.
#[tauri::command]
pub fn steam_get_stat_float(
    state: State<'_, SteamClient>,
    name: String,
) -> Result<f32, String> {
    let guard = state.client.lock().map_err(|e| e.to_string())?;
    let client = guard.as_ref().ok_or("Steam not available")?;
    client
        .user_stats()
        .get_stat_f32(&name)
        .map_err(|_| format!("Failed to get stat '{}'", name))
}

/// Commit all pending stat changes to Steam servers.
/// Achievement commands already call this automatically.
#[tauri::command]
pub fn steam_store_stats(state: State<'_, SteamClient>) -> Result<(), String> {
    let guard = state.client.lock().map_err(|e| e.to_string())?;
    let client = guard.as_ref().ok_or("Steam not available")?;
    client
        .user_stats()
        .store_stats()
        .map_err(|_| "Failed to store stats".to_string())
}

// ── DLC ───────────────────────────────────────────────────────────────────────

/// Returns `true` if the user owns and has the specified DLC installed.
#[tauri::command]
pub fn steam_is_dlc_installed(state: State<'_, SteamClient>, app_id: u32) -> bool {
    state.client.lock().map_or(false, |g| {
        g.as_ref()
            .map_or(false, |c| c.apps().is_dlc_installed(AppId(app_id)))
    })
}

// ── Overlay ───────────────────────────────────────────────────────────────────

/// Open the Steam overlay to a specific dialog.
///
/// Valid `dialog` values:
///   "achievements", "community", "friends", "players",
///   "settings", "officialgamegroup", "stats"
#[tauri::command]
pub fn steam_open_overlay(state: State<'_, SteamClient>, dialog: String) -> bool {
    let Ok(guard) = state.client.lock() else {
        return false;
    };
    let Some(client) = guard.as_ref() else {
        return false;
    };
    client.friends().activate_game_overlay(&dialog);
    true
}

/// Open the Steam store page for this game (or a specific `app_id`).
#[tauri::command]
pub fn steam_open_store(state: State<'_, SteamClient>, app_id: Option<u32>) -> bool {
    let Ok(guard) = state.client.lock() else {
        return false;
    };
    let Some(client) = guard.as_ref() else {
        return false;
    };
    let target = app_id
        .map(AppId)
        .unwrap_or_else(|| client.utils().app_id());
    client
        .friends()
        .activate_game_overlay_to_store(target, OverlayToStoreFlag::None);
    true
}
