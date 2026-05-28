#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .on_page_load(on_page_load)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn on_page_load(window: &tauri::Webview, _: &tauri::webview::PageLoadPayload<'_>) {
    #[cfg(not(debug_assertions))]
    let _ = window.eval("document.addEventListener('contextmenu', e => e.preventDefault())");
}
