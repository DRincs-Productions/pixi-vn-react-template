import { narration, type StoredIndexedChoiceInterface, stepHistory } from "@drincs/pixi-vn";
import { useStore } from "@tanstack/react-store";
import { useCallback } from "react";
import { interfaceStore, setInterfaceHidden } from "../stores/useInterfaceStore";
import { setStepBackLoading, setStepLoading } from "../stores/useStepStore";
import useGameProps from "./useGameProps";

export default function useNarrationFunctions() {
    const hidden = useStore(interfaceStore, (state) => state.hidden);
    const gameProps = useGameProps();

    const goNext = useCallback(async () => {
        setStepLoading(true);
        try {
            if (hidden) {
                setInterfaceHidden(false);
            }
            if (!narration.canContinue) {
                setStepLoading(false);
                return;
            }
            return narration
                .continue(gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    setStepLoading(false);
                })
                .catch((e) => {
                    setStepLoading(false);
                    console.error(e);
                });
        } catch (e) {
            setStepLoading(false);
            console.error(e);
            return;
        }
    }, [gameProps, hidden]);

    const goBack = useCallback(async () => {
        setStepBackLoading(true);
        return stepHistory
            .back(gameProps)
            .then(() => {
                setStepBackLoading(false);
                gameProps.invalidateInterfaceData();
            })
            .catch((e) => {
                setStepBackLoading(false);
                console.error(e);
            });
    }, [gameProps]);

    const selectChoice = useCallback(
        async (item: StoredIndexedChoiceInterface) => {
            setStepLoading(true);
            return narration
                .selectChoice(item, gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    setStepLoading(false);
                })
                .catch((e) => {
                    setStepLoading(false);
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
