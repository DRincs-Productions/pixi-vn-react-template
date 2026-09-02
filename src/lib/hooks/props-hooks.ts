import { Game, type StepLabelProps } from "@drincs/pixi-vn";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useGameProps(): StepLabelProps {
    const navigate = useNavigate();
    const { t } = useTranslation(["narration"]);
    const { t: uiTransition } = useTranslation(["ui"]);
    const queryClient = useQueryClient();

    const props: StepLabelProps = {
        navigate,
        t,
        uiTransition,
        toast,
        invalidateInterfaceData: async (delay: number = 0) => {
            if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
            return await queryClient.invalidateQueries();
        },
    };
    // Keeps window.pixiVN (see the pixi-vn-testing skill) driving the real UI (navigate/toast/...)
    // during an AI-driven test session. A no-op when Game.testing isn't enabled.
    Game.testing.setProps(props);
    return props;
}
