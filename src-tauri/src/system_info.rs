use serde::Serialize;

#[derive(Serialize)]
pub struct SystemInfo {
    /// Specific OS/distro name (e.g. "Ubuntu", "Windows", "Mac OS"), not just the generic platform.
    os_type: String,
    os_version: String,
    bitness: String,
    architecture: String,
}

/// Native OS/distro details, unavailable to plain web JS (browsers deliberately
/// don't expose this to limit fingerprinting).
#[tauri::command]
pub fn get_system_info() -> SystemInfo {
    let info = os_info::get();
    SystemInfo {
        os_type: info.os_type().to_string(),
        os_version: info.version().to_string(),
        bitness: info.bitness().to_string(),
        architecture: info
            .architecture()
            .map(str::to_string)
            .unwrap_or_else(|| std::env::consts::ARCH.to_string()),
    }
}

/// Underlying WebView engine version (WebView2 on Windows, WebKitGTK on Linux,
/// WKWebView on macOS/iOS, Android System WebView on Android).
#[tauri::command]
pub fn get_webview_version() -> Result<String, String> {
    tauri::webview_version().map_err(|e| e.to_string())
}
