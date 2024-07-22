import { atom } from "recoil";

export const typewriterIsAnimatedState = atom<boolean>({
    key: 'typewriterIsAnimated',
    default: false,
});
