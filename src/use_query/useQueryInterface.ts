import { CharacterInterface, narration, stepHistory } from "@drincs/pixi-vn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Character from "../models/Character";

export const INTERFACE_DATA_USE_QUEY_KEY = "interface_data_use_quey_key";

const CAN_GO_BACK_USE_QUEY_KEY = "can_go_back_use_quey_key";
export function useQueryCanGoBack() {
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CAN_GO_BACK_USE_QUEY_KEY],
        queryFn: () => {
            return stepHistory.canGoBack;
        },
    });
}

const CHOICE_MENU_OPTIONS_USE_QUEY_KEY = "choice_menu_options_use_quey_key";
export function useQueryChoiceMenuOptions() {
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CHOICE_MENU_OPTIONS_USE_QUEY_KEY],
        queryFn: () => {
            return narration.choiceMenuOptions || [];
        },
    });
}

const INPUT_VALUE_USE_QUEY_KEY = "input_value_use_quey_key";
export function useQueryInputValue<T>() {
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, INPUT_VALUE_USE_QUEY_KEY],
        queryFn: () => {
            return {
                isRequired: narration.isRequiredInput,
                type: narration.inputType,
                currentValue: narration.inputValue as T | undefined,
            };
        },
    });
}

type DialogueModel = {
    text?: string;
    oldText?: string;
    character?: CharacterInterface;
};
const DIALOGUE_USE_QUEY_KEY = "dialogue_use_quey_key";
export function useQueryDialogue() {
    const { t: tNarration } = useTranslation(["narration"]);
    const queryClient = useQueryClient();

    return useQuery<DialogueModel>({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, DIALOGUE_USE_QUEY_KEY],
        queryFn: ({ queryKey }) => {
            let dialogue = narration.dialogue;
            let text = dialogue?.text;
            if (Array.isArray(text)) {
                text = text.join(" ");
            }
            let newCharacter = dialogue?.character;
            if (typeof newCharacter === "string") {
                newCharacter = new Character(newCharacter, { name: tNarration(newCharacter) });
            }

            let prevData = queryClient.getQueryData<DialogueModel>(queryKey) || {};
            let oldText = (prevData.oldText || "") + (prevData.text || "");
            if (text && newCharacter?.id === prevData?.character?.id && text.startsWith(oldText)) {
                let newText = text.slice(oldText.length);
                if (!newText && oldText && newCharacter === prevData?.character) {
                    return prevData;
                }
                return {
                    text: newText,
                    oldText: oldText,
                    character: newCharacter,
                };
            }

            return {
                text: text,
                character: newCharacter,
            };
        },
    });
}

const CAN_GO_NEXT_USE_QUEY_KEY = "can_go_next_use_quey_key";
export function useQueryCanGoNext() {
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CAN_GO_NEXT_USE_QUEY_KEY],
        queryFn: () => {
            return narration.canGoNext && !narration.isRequiredInput;
        },
    });
}

const NARRATIVE_HISTORY_USE_QUEY_KEY = "narrative_history_use_quey_key";
export function useQueryNarrativeHistory({ searchString }: { searchString?: string }) {
    const { t: tNarration } = useTranslation(["narration"]);

    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, NARRATIVE_HISTORY_USE_QUEY_KEY, searchString],
        queryFn: () => {
            return stepHistory.narrativeHistory
                .map((step) => {
                    let character = step.dialogue?.character;
                    if (typeof character === "string") {
                        character = new Character(character, { name: tNarration(character) });
                    }
                    let text = step.dialogue?.text || "";
                    if (Array.isArray(text)) {
                        text = text.join(" ");
                    }
                    return {
                        character: character?.name
                            ? character.name + (character.surname ? " " + character.surname : "")
                            : undefined,
                        text: text,
                        icon: character?.icon,
                        choices: step.choices,
                        inputValue: step.inputValue,
                    };
                })
                .filter((data) => {
                    if (!searchString) return true;
                    return (
                        data.character?.toLowerCase().includes(searchString.toLowerCase()) ||
                        data.text?.toLowerCase().includes(searchString.toLowerCase())
                    );
                });
        },
    });
}
