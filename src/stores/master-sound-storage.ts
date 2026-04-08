import { sound } from "@drincs/pixi-vn";
import { Store } from "@tanstack/store";

type MasterSoundStorage = {
    /**
     * The master volume (0-100)
     */
    volume: number;
    /**
     * Whether the master sound is muted
     */
    muted: boolean;
};

export namespace MasterSound {
    export const store = new Store<MasterSoundStorage>({
        volume: Number(localStorage.getItem(`master_volume`) ?? sound.volumeAll * 100),
        muted: Boolean(localStorage.getItem(`master_muted`) ?? false),
    });

    /**
     * Set the master volume (0-100)
     * @param volume The master volume to set (0-100)
     */
    export function setVolume(volume: number) {
        if (store.state.muted) {
            setMuted(false);
        }
        sound.volumeAll = volume / 100;
        localStorage.setItem(`master_volume`, volume.toString());
        store.setState((state) => ({ ...state, volume: Math.round(volume) }));

        if (Math.round(volume) === 0 && !store.state.muted) {
            setMuted(true);
        }
    }

    /**
     * Set the master muted state
     * @param muted Whether the master sound should be muted
     */
    export function setMuted(muted: boolean) {
        if (muted) {
            sound.muteAll();
        } else {
            sound.unmuteAll();
        }
        localStorage.setItem(`master_muted`, muted.toString());
        store.setState((state) => ({ ...state, muted }));
    }

    /**
     * Toggle the master muted state
     */
    export function toggleMuted() {
        const curr = sound.toggleMuteAll();
        setMuted(curr);
    }
}
