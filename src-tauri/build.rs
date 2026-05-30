use std::{env, fs, path::PathBuf};

fn main() {
    if env::var("CARGO_FEATURE_STEAM").is_ok() {
        copy_steam_lib();
    }
    tauri_build::build()
}

// Copies the Steamworks redistributable library from steamworks-sys's OUT_DIR
// into src-tauri/ so that Tauri's bundler can pick it up as a resource.
fn copy_steam_lib() {
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());
    let manifest_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());

    let lib_name = match env::var("CARGO_CFG_TARGET_OS").as_deref() {
        Ok("windows") => "steam_api64.dll",
        Ok("macos") => "libsteam_api.dylib",
        _ => "libsteam_api.so",
    };

    // OUT_DIR layout: .../target/[profile]/build/[pkg-hash]/out
    // nth(2) walks up to .../target/[profile]/build/
    let build_dir = out_dir
        .ancestors()
        .nth(2)
        .expect("unexpected OUT_DIR layout");

    if let Ok(entries) = fs::read_dir(build_dir) {
        for entry in entries.flatten() {
            let candidate = entry.path().join("out").join(lib_name);
            if candidate.exists() {
                let dest = manifest_dir.join(lib_name);
                fs::copy(&candidate, &dest)
                    .unwrap_or_else(|e| panic!("failed to copy {lib_name}: {e}"));
                println!("cargo:warning=Steam: copied {lib_name} → src-tauri/");
                return;
            }
        }
    }

    panic!(
        "Steam: could not find `{lib_name}` in build artifacts. \
         Ensure `--features steam` is active and the crate compiled successfully."
    );
}
