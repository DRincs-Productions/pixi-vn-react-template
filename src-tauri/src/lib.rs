use tauri::Manager;
#[cfg(not(mobile))]
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

// Steam is only compiled on desktop targets when the "steam" feature is on.
#[cfg(all(feature = "steam", not(target_os = "ios"), not(target_os = "android")))]
mod steam;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .on_page_load(on_page_load);

    #[cfg(not(mobile))]
    let mut builder = builder
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .on_window_event(on_window_event);

    // ── Steam ─────────────────────────────────────────────────────────────────
    // Enabled only when `--features steam` is passed (or `default = ["steam"]`
    // is set in Cargo.toml). Steam is not supported on iOS / Android.
    #[cfg(all(feature = "steam", not(target_os = "ios"), not(target_os = "android")))]
    {
        builder = builder
            .manage(steam::SteamClient {
                client: std::sync::Mutex::new(steam::try_init()),
            })
            .invoke_handler(tauri::generate_handler![
                steam::steam_is_available,
                steam::steam_get_player_name,
                steam::steam_get_app_id,
                steam::steam_unlock_achievement,
                steam::steam_is_achievement_unlocked,
                steam::steam_clear_achievement,
                steam::steam_set_stat_int,
                steam::steam_get_stat_int,
                steam::steam_set_stat_float,
                steam::steam_get_stat_float,
                steam::steam_store_stats,
                steam::steam_is_dlc_installed,
                steam::steam_open_overlay,
                steam::steam_open_store,
            ]);
    }

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn on_page_load(_window: &tauri::Webview, _: &tauri::webview::PageLoadPayload<'_>) {
    #[cfg(not(debug_assertions))]
    let _ = _window.eval("document.addEventListener('contextmenu', e => e.preventDefault())");
}

#[cfg(not(mobile))]
fn on_window_event(window: &tauri::Window, event: &tauri::WindowEvent) {
    if let tauri::WindowEvent::CloseRequested { .. } = event {
        let _ = window.app_handle().save_window_state(StateFlags::all());
    }
}
