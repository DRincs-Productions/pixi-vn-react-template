import { narration, type StoredIndexedChoiceInterface, stepHistory } from "@drincs/pixi-vn";
import { useStore } from "@tanstack/react-store";
import { useCallback } from "react";
import { GameStatus } from "../lib/stores/game-status-store";
import { InterfaceSettings } from "../lib/stores/interface-settings-store";
import useGameProps from "./useGameProps";

export default function useNarrationFunctions() {
    const hidden = useStore(InterfaceSettings.store, (state) => state.hidden);
    const gameProps = useGameProps();

    const goNext = useCallback(async () => {
        GameStatus.setLoading(true);
        try {
            if (hidden) {
                InterfaceSettings.setHidden(false);
            }
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
    }, [gameProps, hidden]);

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
