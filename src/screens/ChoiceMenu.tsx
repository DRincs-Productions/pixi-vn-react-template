import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Grid } from "@mui/joy";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";
import ChoiceButton from "../components/ChoiceButton";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import { useQueryChoiceMenuOptions } from "../hooks/useQueryInterface";
import { GameStatus } from "../stores/game-status-store";
import { InterfaceSettings } from "../stores/interface-settings-store";
import { TypewriterStore } from "../stores/useTypewriterStore";

export default function ChoiceMenu() {
    const nextStepLoading = useStore(GameStatus.store, (state) => state.loading);
    const { data: menu = [] } = useQueryChoiceMenuOptions();
    const typewriterInProgress = useStore(TypewriterStore.store, (state) => state.inProgress);
    const hidden = useStore(InterfaceSettings.store, (state) => state.hidden);
    const { selectChoice } = useNarrationFunctions();
    const [open, setOpen] = useState(false);

    const [debouncedOpen] = useDebouncedValue(!(hidden || menu.length == 0 || typewriterInProgress), { wait: 100 });
    useEffect(() => {
        setOpen(debouncedOpen);
    }, [debouncedOpen]);

    if (!open) return null;

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            rowSpacing={2}
            sx={{
                overflow: "auto",
                height: "100%",
                gap: 1,
                width: "100%",
                pointerEvents: hidden ? "none" : "auto",
                margin: 0,
            }}
            role="menu"
        >
            {menu.map((item, index) => (
                <Grid
                    key={"choice-" + index}
                    justifyContent="center"
                    alignItems="center"
                    className={
                        hidden
                            ? "motion-opacity-out-0 motion-translate-y-out-[50%]"
                            : `motion-opacity-in-0 motion-translate-y-in-[50%] motion-delay-[${index * 200}ms]`
                    }
                >
                    <ChoiceButton
                        loading={nextStepLoading}
                        onClick={() =>
                            selectChoice(item).then(() => {
                                setOpen(false);
                            })
                        }
                        sx={{
                            left: 0,
                            right: 0,
                        }}
                        startDecorator={item.type === "close" ? <KeyboardReturnIcon /> : undefined}
                    >
                        {item.text}
                    </ChoiceButton>
                </Grid>
            ))}
        </Grid>
    );
}
