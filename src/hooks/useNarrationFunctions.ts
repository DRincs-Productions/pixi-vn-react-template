import { narration, type StoredIndexedChoiceInterface, stepHistory } from "@drincs/pixi-vn";
import { useStore } from "@tanstack/react-store";
import { useCallback } from "react";
import { InterfaceStore } from "../stores/useInterfaceStore";
import { StepStore } from "../stores/useStepStore";
import useGameProps from "./useGameProps";

export default function useNarrationFunctions() {
    const hidden = useStore(InterfaceStore.store, (state) => state.hidden);
    const gameProps = useGameProps();

    const goNext = useCallback(async () => {
        StepStore.setLoading(true);
        try {
            if (hidden) {
                InterfaceStore.setHidden(false);
            }
            if (!narration.canContinue) {
                StepStore.setLoading(false);
                return;
            }
            return narration
                .continue(gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    StepStore.setLoading(false);
                })
                .catch((e) => {
                    StepStore.setLoading(false);
                    console.error(e);
                });
        } catch (e) {
            StepStore.setLoading(false);
            console.error(e);
            return;
        }
    }, [gameProps, hidden]);

    const goBack = useCallback(async () => {
        StepStore.setBackLoading(true);
        return stepHistory
            .back(gameProps)
            .then(() => {
                StepStore.setBackLoading(false);
                gameProps.invalidateInterfaceData();
            })
            .catch((e) => {
                StepStore.setBackLoading(false);
                console.error(e);
            });
    }, [gameProps]);

    const selectChoice = useCallback(
        async (item: StoredIndexedChoiceInterface) => {
            StepStore.setLoading(true);
            return narration
                .selectChoice(item, gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    StepStore.setLoading(false);
                })
                .catch((e) => {
                    StepStore.setLoading(false);
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
