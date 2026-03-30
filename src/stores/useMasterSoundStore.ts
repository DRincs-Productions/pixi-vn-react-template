import { sound } from "@drincs/pixi-vn";
import { create } from "zustand";
import { ChannelSoundStore } from "./createChannelSoundStore";

const useMasterSoundStore = create<ChannelSoundStore>((set, get) => ({
    volume: sound.volumeAll,
    muted: false,

    setVolume: (volume: number) => {
        const nv = Math.max(0, Math.min(100, Math.round(volume)));
        sound.volumeAll = nv / 100;
        set({ volume: nv });
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
