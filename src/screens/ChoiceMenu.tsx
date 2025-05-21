import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Grid } from "@mui/joy";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ChoiceButton from "../components/ChoiceButton";
import useDebouncedEffect from "../hooks/useDebouncedEffect";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import useInterfaceStore from "../stores/useInterfaceStore";
import useStepStore from "../stores/useStepStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import { useQueryChoiceMenuOptions } from "../use_query/useQueryInterface";

export default function ChoiceMenu() {
    const nextStepLoading = useStepStore((state) => state.loading);
    const { data: menu = [] } = useQueryChoiceMenuOptions();
    const typewriterInProgress = useTypewriterStore(useShallow((state) => state.inProgress));
    const hidden = useInterfaceStore(useShallow((state) => state.hidden));
    const { selectChoice } = useNarrationFunctions();
    const [open, setOpen] = useState(false);

    useDebouncedEffect(() => setOpen(!(hidden || menu.length == 0 || typewriterInProgress)), { delay: 50 }, [
        hidden,
        menu,
        typewriterInProgress,
    ]);

    return (
        <Grid
            container
            direction='column'
            justifyContent='center'
            alignItems='center'
            rowSpacing={2}
            sx={{
                overflow: "auto",
                height: "100%",
                gap: 1,
                width: "100%",
                pointerEvents: hidden ? "none" : "auto",
                margin: 0,
            }}
        >
            {open &&
                menu?.map((item, index) => {
                    return (
                        <Grid
                            key={"choice-" + index}
                            justifyContent='center'
                            alignItems='center'
                            className={
                                hidden
                                    ? "motion-opacity-out-0 motion-translate-y-out-[50%]"
                                    : `motion-opacity-in-0 motion-translate-y-in-[50%] motion-delay-[${index * 200}ms]`
                            }
                        >
                            <ChoiceButton
                                loading={nextStepLoading}
                                onClick={() => selectChoice(item)}
                                sx={{
                                    left: 0,
                                    right: 0,
                                }}
                                startDecorator={item.type == "close" ? <KeyboardReturnIcon /> : undefined}
                            >
                                {item.text}
                            </ChoiceButton>
                        </Grid>
                    );
                })}
        </Grid>
    );
}
