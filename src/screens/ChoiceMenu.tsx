import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Grid } from "@mui/joy";
import ChoiceButton from "../components/ChoiceButton";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import useInterfaceStore from "../stores/useInterfaceStore";
import useStepStore from "../stores/useStepStore";
import { useQueryChoiceMenuOptions } from "../use_query/useQueryInterface";

export default function ChoiceMenu() {
    const nextStepLoading = useStepStore((state) => state.loading);
    const { data: menu = [] } = useQueryChoiceMenuOptions();
    const hidden = useInterfaceStore((state) => state.hidden || menu.length == 0);
    const { selectChoice } = useNarrationFunctions();

    return (
        <Grid
            container
            direction='column'
            justifyContent='center'
            alignItems='center'
            spacing={2}
            sx={{
                overflow: "auto",
                height: "100%",
                gap: 1,
                width: "100%",
                pointerEvents: hidden ? "none" : "auto",
            }}
        >
            {menu?.map((item, index) => {
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
