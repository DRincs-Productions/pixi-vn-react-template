import { sound } from "@drincs/pixi-vn";
import { Store } from "@tanstack/store";

export type ChannelSoundState = {
    volume: number;
    muted: boolean;
};

export namespace ChannelSoundStore {
    const storeCache = new Map<string, Store<ChannelSoundState>>();

    export function getStore(alias: string): Store<ChannelSoundState> {
        if (!storeCache.has(alias)) {
            storeCache.set(
                alias,
                new Store<ChannelSoundState>({
                    volume: localStorage.getItem(`${alias}_volume`)
                        ? parseInt(localStorage.getItem(`${alias}_volume`)!)
                        : sound.findChannel(alias).volume * 100,
                    muted: localStorage.getItem(`${alias}_muted`)
                        ? localStorage.getItem(`${alias}_muted`) === "true"
                        : sound.findChannel(alias).muted,
                }),
            );
        }
        return storeCache.get(alias)!;
    }

    export function setVolume(alias: string, volume: number) {
        const store = getStore(alias);
        if (store.state.muted) {
            setMuted(alias, false);
        }
        sound.findChannel(alias).volume = volume / 100;
        localStorage.setItem(`${alias}_volume`, volume.toString());
        store.setState((state) => ({ ...state, volume: Math.round(volume) }));

        if (Math.round(volume) === 0 && !store.state.muted) {
            setMuted(alias, true);
        }
    }

    export function setMuted(alias: string, muted: boolean) {
        sound.findChannel(alias).muted = muted;
        localStorage.setItem(`${alias}_muted`, muted.toString());
        getStore(alias).setState((state) => ({ ...state, muted }));
    }

    export function toggleMuted(alias: string) {
        const curr = sound.findChannel(alias).toggleMuteAll();
        setMuted(alias, curr);
    }
}
