import { clearAllGameDatas, narration } from "@drincs/pixi-vn";

export async function goBack(navigate: (path: string) => void) {
    await narration.goBack(navigate)
}

export function gameEnd(navigate: (path: string) => void) {
    clearAllGameDatas()
    navigate('/')
}
