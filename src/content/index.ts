// Auto-load every content module for side effects (e.g. narration registrations).
void import.meta.glob(["./**/*.ts", "./**/*.tsx", "!./index.ts"], {
    eager: true,
});
