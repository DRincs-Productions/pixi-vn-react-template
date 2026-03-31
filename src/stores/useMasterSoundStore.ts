import { sound } from "@drincs/pixi-vn";
import { create } from "zustand";
import { ChannelSoundStore } from "./createChannelSoundStore";

const useMasterSoundStore = create<ChannelSoundStore>((set, get) => ({
    volume: localStorage.getItem(`master_volume`)
        ? parseInt(localStorage.getItem(`master_volume`)!)
        : sound.volumeAll * 100,
    muted: localStorage.getItem(`$master_muted`) ? localStorage.getItem(`master_muted`) === "true" : false,

    setVolume: (volume: number) => {
        sound.volumeAll = volume / 100;
        set({ volume: Math.round(volume) });
    },

    setMuted: (muted: boolean) => {
        if (muted) {
            sound.muteAll();
        } else {
            sound.unmuteAll();
        }
        set({ muted: muted });
    },

    toggleMuted: () => {
        const curr = sound.toggleMuteAll();
        get().setMuted(curr);
    },
}));

export default useMasterSoundStore;
