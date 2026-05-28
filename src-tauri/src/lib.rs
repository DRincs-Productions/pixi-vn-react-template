use tauri::Manager;
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .on_page_load(on_page_load)
        .on_window_event(on_window_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn on_page_load(window: &tauri::Webview, _: &tauri::webview::PageLoadPayload<'_>) {
    #[cfg(not(debug_assertions))]
    let _ = window.eval("document.addEventListener('contextmenu', e => e.preventDefault())");
}

fn on_window_event(window: &tauri::Window, event: &tauri::WindowEvent) {
    if let tauri::WindowEvent::CloseRequested { .. } = event {
        let _ = window.app_handle().save_window_state(StateFlags::all());
    }
}
