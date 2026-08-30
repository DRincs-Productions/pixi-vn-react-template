/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __APP_NAME__: string;

// `tsconfig.app.json`'s `types` is deliberately scoped to `["vite/client"]` only (no Node
// globals), so `process.env.ROVES_BUILD` (replaced by `vite.config.ts`'s own `define`, the
// same mechanism `__APP_VERSION__`/`__APP_NAME__` above use) needs this minimal ambient
// declaration rather than pulling in all of `@types/node`'s `process`.
declare const process: { env: { ROVES_BUILD?: string } };
