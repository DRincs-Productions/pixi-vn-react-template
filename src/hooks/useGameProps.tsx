import { StepLabelProps } from "@drincs/pixi-vn";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useMyNavigate from "./useMyNavigate";

export default function useGameProps(): StepLabelProps {
    const navigate = useMyNavigate();
    const { t } = useTranslation(["narration"]);
    const { t: uiTransition } = useTranslation(["ui"]);
    const { enqueueSnackbar } = useSnackbar();

    return {
        navigate,
        t,
        uiTransition,
        notify: enqueueSnackbar,
    };
}
