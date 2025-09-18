import { narration, stepHistory, StoredIndexedChoiceInterface } from "@drincs/pixi-vn";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import useInterfaceStore from "../stores/useInterfaceStore";
import useStepStore from "../stores/useStepStore";
import useGameProps from "./useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY } from "./useQueryInterface";

export default function useNarrationFunctions() {
    const setNextStepLoading = useStepStore(useShallow((state) => state.setLoading));
    const setBackLoading = useStepStore((state) => state.setBackLoading);
    const hidden = useInterfaceStore(useShallow((state) => state.hidden));
    const setHideInterface = useInterfaceStore((state) => state.setHidden);
    const queryClient = useQueryClient();
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
                    queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
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
    }, [gameProps, queryClient]);

    const goBack = useCallback(async () => {
        setBackLoading(true);
        return stepHistory
            .back(gameProps.navigate)
            .then(() => {
                setBackLoading(false);
                queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
            })
            .catch((e) => {
                setBackLoading(false);
                console.error(e);
            });
    }, [gameProps, queryClient]);

    const selectChoice = useCallback(
        async (item: StoredIndexedChoiceInterface) => {
            setNextStepLoading(true);
            return narration
                .selectChoice(item, gameProps)
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
                    setNextStepLoading(false);
                })
                .catch((e) => {
                    setNextStepLoading(false);
                    console.error(e);
                });
        },
        [gameProps, queryClient]
    );

    return {
        goNext,
        goBack,
        selectChoice,
    };
}
