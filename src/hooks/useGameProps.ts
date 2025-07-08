import { StepLabelProps } from "@drincs/pixi-vn";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useMyNavigate from "./useMyNavigate";
import { INTERFACE_DATA_USE_QUEY_KEY } from "./useQueryInterface";

export default function useGameProps(): StepLabelProps {
    const navigate = useMyNavigate();
    const { t } = useTranslation(["narration"]);
    const { t: uiTransition } = useTranslation(["ui"]);
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    return {
        navigate,
        t,
        uiTransition,
        notify: enqueueSnackbar,
        invalidateInterfaceData: () => {
            queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
        },
    };
}
