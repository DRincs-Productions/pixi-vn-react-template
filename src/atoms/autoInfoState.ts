import { atom, selector } from "recoil";

type AutoInfo = {
    /**
     * Whether auto forward is enabled
     */
    enabled: boolean,
    /**
     * Time in seconds to wait before auto forwarding
     */
    time: number,
    /**
     * Force recheck the auto forward
     */
    update: number,
}

const autoInfoAtomState = atom<AutoInfo>({
    key: 'autoInfoAtomState',
    default: {
        enabled: false,
        time: 1,
        update: 0,
    },
});

export const autoInfoState = selector<AutoInfo>({
    key: 'autoInfoState',
    get: ({ get }) => {
        let time: number | undefined = undefined
        try {
            let v = localStorage.getItem("auto_forward_second")
            if (v) {
                time = parseInt(v)
            }
        } catch (e) { }

        let info = get(autoInfoAtomState)
        return {
            ...info,
            time: time || info.time,
        }
    },
    set: ({ set }, value) => {
        if (value.hasOwnProperty("time")) {
            localStorage.setItem("auto_forward_second", (value as AutoInfo).time.toString())
        }
        set(autoInfoAtomState, value)
    },
});
