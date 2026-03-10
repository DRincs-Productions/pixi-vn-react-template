import { narration, stepHistory, StoredIndexedChoiceInterface } from "@drincs/pixi-vn";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import useInterfaceStore from "../stores/useInterfaceStore";
import useStepStore from "../stores/useStepStore";
import useGameProps from "./useGameProps";

export default function useNarrationFunctions() {
    const setNextStepLoading = useStepStore(useShallow((state) => state.setLoading));
    const setBackLoading = useStepStore((state) => state.setBackLoading);
    const hidden = useInterfaceStore(useShallow((state) => state.hidden));
    const setHideInterface = useInterfaceStore((state) => state.setHidden);
    const gameProps = useGameProps();

    const goNext = useCallback(async () => {
        setNextStepLoading(true);
        try {
            if (hidden) {
                setHideInterface(false);
            }
            if (!narration.canContinue) {
                setNextStepLoading(false);
                return;
            }
            return narration
                .continue(gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    setNextStepLoading(false);
                })
                .catch((e) => {
                    setNextStepLoading(false);
                    console.error(e);
                });
        } catch (e) {
            setNextStepLoading(false);
            console.error(e);
            return;
        }
    }, [gameProps]);

    const goBack = useCallback(async () => {
        setBackLoading(true);
        return stepHistory
            .back(gameProps)
            .then(() => {
                setBackLoading(false);
                gameProps.invalidateInterfaceData();
            })
            .catch((e) => {
                setBackLoading(false);
                console.error(e);
            });
    }, [gameProps]);

    const selectChoice = useCallback(
        async (item: StoredIndexedChoiceInterface) => {
            setNextStepLoading(true);
            return narration
                .selectChoice(item, gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    setNextStepLoading(false);
                })
                .catch((e) => {
                    setNextStepLoading(false);
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
