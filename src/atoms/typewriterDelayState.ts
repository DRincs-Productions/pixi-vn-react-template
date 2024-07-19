import { atom, selector } from "recoil";

export const typewriterDelayAtomState = atom<number>({
    key: 'typewriterDelayAtomState',
    default: localStorage.getItem('typewriter_delay_millisecond') ? parseInt(localStorage.getItem('typewriter_delay_millisecond')!) : 10,
});

export const typewriterDelayState = selector<number>({
    key: 'typewriterDelayState',
    get: ({ get }) => {
        return get(typewriterDelayAtomState)
    },
    set: ({ set }, value) => {
        if (typeof value === "number") {
            let valueString = value.toString()
            localStorage.setItem("typewriter_delay_millisecond", valueString)
        }
        else {
            localStorage.removeItem("typewriter_delay_millisecond")
        }
        set(typewriterDelayAtomState, value)
    },
});
