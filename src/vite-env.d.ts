/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __APP_NAME__: string;

// tinykeys v3 does not include "types" in its package.json exports field,
// so we re-export its type declarations here to satisfy moduleResolution:bundler.
declare module "tinykeys" {
    export {
        tinykeys,
        createKeybindingsHandler,
        matchKeyBindingPress,
        parseKeybinding,
    } from "../node_modules/tinykeys/dist/tinykeys";
    export type {
        KeyBindingMap,
        KeyBindingOptions,
        KeyBindingHandlerOptions,
        KeyBindingPress,
    } from "../node_modules/tinykeys/dist/tinykeys";
}
