import { sound } from "@drincs/pixi-vn";
import { Store } from "@tanstack/store";

type MasterSoundState = {
    volume: number;
    muted: boolean;
};

export const masterSoundStore = new Store<MasterSoundState>({
    volume: localStorage.getItem(`master_volume`)
        ? parseInt(localStorage.getItem(`master_volume`)!)
        : sound.volumeAll * 100,
    muted: localStorage.getItem(`$master_muted`) ? localStorage.getItem(`master_muted`) === "true" : false,
});

export const setMuted = (muted: boolean) => {
    if (muted) {
        sound.muteAll();
    } else {
        sound.unmuteAll();
    }
    masterSoundStore.setState((state) => ({ ...state, muted }));
};

export const setVolume = (volume: number) => {
    if (masterSoundStore.state.muted) {
        setMuted(false);
    }
    sound.volumeAll = volume / 100;
    masterSoundStore.setState((state) => ({ ...state, volume: Math.round(volume) }));

    if (Math.round(volume) === 0 && !masterSoundStore.state.muted) {
        setMuted(true);
    }
};

export const toggleMuted = () => {
    const curr = sound.toggleMuteAll();
    setMuted(curr);
};
