import { SaveData as PiviVNSaveData } from "@drincs/pixi-vn"

export default interface GameSaveData {
    saveData: PiviVNSaveData
    gameVersion: string
    date: Date
    name: string
    image?: string
}
