import { sound } from "@drincs/pixi-vn";
import { Store } from "@tanstack/store";

export type ChannelSoundState = {
    volume: number;
    muted: boolean;
};

const channelStores = new Map<string, Store<ChannelSoundState>>();

export function getChannelSoundStore(alias: string): Store<ChannelSoundState> {
    if (!channelStores.has(alias)) {
        channelStores.set(
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
    return channelStores.get(alias)!;
}

export function setChannelMuted(alias: string, muted: boolean) {
    sound.findChannel(alias).muted = muted;
    localStorage.setItem(`${alias}_muted`, muted.toString());
    getChannelSoundStore(alias).setState((state) => ({ ...state, muted }));
}

export function setChannelVolume(alias: string, volume: number) {
    const store = getChannelSoundStore(alias);
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

export function toggleChannelMuted(alias: string) {
    const curr = sound.findChannel(alias).toggleMuteAll();
    setChannelMuted(alias, curr);
}
