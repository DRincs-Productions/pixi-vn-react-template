import { useStore } from "@tanstack/react-store";
import { narration, type StoredIndexedChoiceInterface, stepHistory } from "@drincs/pixi-vn";
import { useCallback } from "react";
import { interfaceStore, setHidden as setInterfaceHidden } from "../stores/useInterfaceStore";
import { setBackLoading, setLoading } from "../stores/useStepStore";
import useGameProps from "./useGameProps";

export default function useNarrationFunctions() {
    const hidden = useStore(interfaceStore, (state) => state.hidden);
    const gameProps = useGameProps();

    const goNext = useCallback(async () => {
        setLoading(true);
        try {
            if (hidden) {
                setInterfaceHidden(false);
            }
            if (!narration.canContinue) {
                setLoading(false);
                return;
            }
            return narration
                .continue(gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    setLoading(false);
                })
                .catch((e) => {
                    setLoading(false);
                    console.error(e);
                });
        } catch (e) {
            setLoading(false);
            console.error(e);
            return;
        }
    }, [gameProps, hidden]);

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
            setLoading(true);
            return narration
                .selectChoice(item, gameProps)
                .then(() => {
                    gameProps.invalidateInterfaceData();
                    setLoading(false);
                })
                .catch((e) => {
                    setLoading(false);
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
