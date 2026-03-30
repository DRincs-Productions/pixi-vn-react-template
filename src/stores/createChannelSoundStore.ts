import { sound } from "@drincs/pixi-vn";
import { create } from "zustand";

export type ChannelSoundStore = {
    volume: number;
    muted: boolean;
    setVolume: (v: number) => void;
    setMuted: (m: boolean) => void;
    toggleMuted: () => void;
};

export default function createChannelSoundStore(alias: string) {
    const useChannelStore = create<ChannelSoundStore>((set, get) => ({
        volume: sound.findChannel(alias).volume * 100,
        muted: sound.findChannel(alias).muted,

        setVolume: (volume: number) => {
            const nv = Math.max(0, Math.min(100, Math.round(volume)));
            sound.findChannel(alias).volume = nv / 100;
            set({ volume: nv });
        },

        setMuted: (muted: boolean) => {
            sound.findChannel(alias).muted = muted;
            set({ muted: muted });
        },

        toggleMuted: () => {
            const curr = sound.findChannel(alias).toggleMuteAll();
            get().setMuted(curr);
        },
    }));

    return useChannelStore;
}
