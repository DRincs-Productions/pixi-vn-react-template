import { narration, stepHistory, type StoredIndexedChoiceInterface } from "@drincs/pixi-vn";
import { useCallback } from "react";
import { GameStatus } from "../lib/stores/game-status-store";
import useGameProps from "./useGameProps";

export default function useNarrationFunctions() {
    const gameProps = useGameProps();

    const goNext = useCallback(async () => {
        GameStatus.setLoading(true);
        try {
            if (!narration.canContinue) {
                GameStatus.setLoading(false);
                return;
            }
            return narration
                .continue(gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    GameStatus.setLoading(false);
                })
                .catch((e) => {
                    GameStatus.setLoading(false);
                    console.error(e);
                });
        } catch (e) {
            GameStatus.setLoading(false);
            console.error(e);
            return;
        }
    }, [gameProps]);

    const goBack = useCallback(async () => {
        GameStatus.setLoading(true);
        return stepHistory
            .back(gameProps)
            .then(() => {
                GameStatus.setLoading(false);
                gameProps.invalidateInterfaceData();
            })
            .catch((e) => {
                GameStatus.setLoading(false);
                console.error(e);
            });
    }, [gameProps]);

    const selectChoice = useCallback(
        async (item: StoredIndexedChoiceInterface) => {
            GameStatus.setLoading(true);
            return narration
                .selectChoice(item, gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    GameStatus.setLoading(false);
                })
                .catch((e) => {
                    GameStatus.setLoading(false);
                    console.error(e);
                });
        },
        [gameProps],
    );

    return {
        goNext,
        goBack,
        selectChoice,
    };
}
