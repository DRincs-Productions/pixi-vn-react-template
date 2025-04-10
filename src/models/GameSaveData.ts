import { GameState } from "@drincs/pixi-vn";

export default interface GameSaveData {
    saveData: GameState;
    gameVersion: string;
    date: Date;
    name: string;
    image?: string;
}
