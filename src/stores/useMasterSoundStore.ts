import { sound } from "@drincs/pixi-vn";
import { Store } from "@tanstack/store";

type MasterSoundState = {
    volume: number;
    muted: boolean;
};

export namespace MasterSoundStore {
    export const store = new Store<MasterSoundState>({
        volume: localStorage.getItem(`master_volume`)
            ? parseInt(localStorage.getItem(`master_volume`)!)
            : sound.volumeAll * 100,
        muted: localStorage.getItem(`$master_muted`) ? localStorage.getItem(`master_muted`) === "true" : false,
    });

    export function setVolume(volume: number) {
        if (store.state.muted) {
            setMuted(false);
        }
        sound.volumeAll = volume / 100;
        store.setState((state) => ({ ...state, volume: Math.round(volume) }));

        if (Math.round(volume) === 0 && !store.state.muted) {
            setMuted(true);
        }
    }

    export function setMuted(muted: boolean) {
        if (muted) {
            sound.muteAll();
        } else {
            sound.unmuteAll();
        }
        store.setState((state) => ({ ...state, muted }));
    }

    export function toggleMuted() {
        const curr = sound.toggleMuteAll();
        setMuted(curr);
    }
}
