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
        volume: localStorage.getItem(`${alias}_volume`)
            ? parseInt(localStorage.getItem(`${alias}_volume`)!)
            : sound.findChannel(alias).volume * 100,
        muted: localStorage.getItem(`${alias}_muted`)
            ? localStorage.getItem(`${alias}_muted`) === "true"
            : sound.findChannel(alias).muted,

        setVolume: (volume: number) => {
            sound.findChannel(alias).volume = volume / 100;
            localStorage.setItem(`${alias}_volume`, volume.toString());
            set({ volume: Math.round(volume) });
        },

        setMuted: (muted: boolean) => {
            sound.findChannel(alias).muted = muted;
            localStorage.setItem(`${alias}_muted`, muted.toString());
            set({ muted: muted });
        },

        toggleMuted: () => {
            const curr = sound.findChannel(alias).toggleMuteAll();
            get().setMuted(curr);
        },
    }));

    return useChannelStore;
}
