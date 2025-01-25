import { Button } from "@mui/joy";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import ModalDialogCustom, { ModalDialogCustomProps } from "./ModalDialog";

interface ModalConfirmationProps extends Omit<ModalDialogCustomProps, "actions"> {
    onConfirm?: () => boolean | Promise<boolean>;
    onCancel?: () => void;
    disabledConfirm?: boolean;
    startDecorator?: ReactNode;
}

export default function ModalConfirmation(props: ModalConfirmationProps) {
    const { setOpen, onConfirm, onCancel, children, color, disabledConfirm, startDecorator, ...rest } = props;
    const { t } = useTranslation(["ui"]);
    const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);

    return (
        <ModalDialogCustom
            setOpen={setOpen}
            color={color}
            actions={[
                <Button
                    key='confirm-button'
                    color={color}
                    onClick={async () => {
                        if (onConfirm) {
                            setLoadingConfirm(true);
                            try {
                                let result = await onConfirm();
                                setLoadingConfirm(false);
                                setOpen(!result);
                            } catch (_error) {
                                setLoadingConfirm(false);
                            }
                        }
                    }}
                    disabled={disabledConfirm}
                    fullWidth={false}
                    loading={loadingConfirm}
                    startDecorator={startDecorator}
                >
                    {t("confirm")}
                </Button>,
                <Button
                    key='cancel-button'
                    variant='plain'
                    color='neutral'
                    onClick={() => setOpen(false)}
                    fullWidth={false}
                    disabled={loadingConfirm}
                >
                    {t("cancel")}
                </Button>,
            ]}
            {...rest}
        >
            {children}
        </ModalDialogCustom>
    );
}
