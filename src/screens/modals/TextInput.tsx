import { narration } from '@drincs/pixi-vn';
import { Button, Input } from '@mui/joy';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { typewriterIsAnimatedState } from '../../atoms/typewriterIsAnimatedState';
import ModalDialogCustom from '../../components/ModalDialog';
import Typewriter from '../../components/Typewriter';
import { INTERFACE_DATA_USE_QUEY_KEY, useQueryDialogue, useQueryInputValue } from '../../use_query/useQueryInterface';

export default function TextInput() {
    const { data: { text } = {} } = useQueryDialogue()
    const { data: { isRequired, type } = { currentValue: undefined, isRequired: false } } = useQueryInputValue();
    const open = (!useRecoilValue(typewriterIsAnimatedState)) && isRequired
    const [tempValue, setTempValue] = useState();
    const queryClient = useQueryClient()
    const { t } = useTranslation(["ui"]);

    return (
        <ModalDialogCustom
            open={open}
            setOpen={(value) => {
                if (!value) {
                    narration.inputValue = tempValue
                    queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] })
                }
            }}
            canBeIgnored={false}
            color="primary"
            actions={<>
                <Button
                    key={'exit'}
                    color='primary'
                    variant="outlined"
                    onClick={() => {
                        narration.inputValue = tempValue
                        queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] })
                    }}
                >
                    {t("confirm")}
                </Button>
                <Input
                    value={tempValue}
                    type={type}
                    onChange={(e) => {
                        let value: any = e.target.value;
                        if (e.target.type === "number") {
                            value = e.target.valueAsNumber
                        }
                        setTempValue(value)
                    }}
                />
            </>}
        >
            {text && <Typewriter
                text={text}
            />}
        </ModalDialogCustom>
    );
}
