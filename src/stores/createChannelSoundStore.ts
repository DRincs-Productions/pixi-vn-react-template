import { sound } from "@drincs/pixi-vn";
import { Store } from "@tanstack/store";

export type ChannelSoundState = {
    volume: number;
    muted: boolean;
};

const storeCache = new Map<string, Store<ChannelSoundState>>();

export function getChannelStore(alias: string): Store<ChannelSoundState> {
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

export function setChannelVolume(alias: string, volume: number) {
    const store = getChannelStore(alias);
    if (store.state.muted) {
        setChannelMuted(alias, false);
    }
    sound.findChannel(alias).volume = volume / 100;
    localStorage.setItem(`${alias}_volume`, volume.toString());
    store.setState((state) => ({ ...state, volume: Math.round(volume) }));

    if (Math.round(volume) === 0 && !store.state.muted) {
        setChannelMuted(alias, true);
    }
}

export function setChannelMuted(alias: string, muted: boolean) {
    sound.findChannel(alias).muted = muted;
    localStorage.setItem(`${alias}_muted`, muted.toString());
    getChannelStore(alias).setState((state) => ({ ...state, muted }));
}

export function toggleChannelMuted(alias: string) {
    const curr = sound.findChannel(alias).toggleMuteAll();
    setChannelMuted(alias, curr);
}
