import { sound } from "@drincs/pixi-vn";
import { create } from "zustand";
import { ChannelSoundStore } from "./createChannelSoundStore";

const useMasterSoundStore = create<ChannelSoundStore>((set, get) => ({
    volume: sound.volumeAll,
    muted: false,

    setVolume: (volume: number) => {
        sound.volumeAll = volume / 100;
        set({ volume: volume });
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
