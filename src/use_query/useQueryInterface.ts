import { CharacterBaseModel, getCharacterById, narration } from "@drincs/pixi-vn";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export const INTERFACE_DATA_USE_QUEY_KEY = "interface_data_use_quey_key";

const CAN_GO_BACK_USE_QUEY_KEY = "can_go_back_use_quey_key";
export function useQueryCanGoBack() {
	return useQuery({
		queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CAN_GO_BACK_USE_QUEY_KEY],
		queryFn: () => {
			return narration.canGoBack
		},
	});
}

const CHOICE_MENU_OPTIONS_USE_QUEY_KEY = "choice_menu_options_use_quey_key";
export function useQueryChoiceMenuOptions() {
	return useQuery({
		queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CHOICE_MENU_OPTIONS_USE_QUEY_KEY],
		queryFn: () => {
			return narration.choiceMenuOptions || []
		},
	});
}

const INPUT_VALUE_USE_QUEY_KEY = "input_value_use_quey_key";
export function useQueryInputValue() {
	return useQuery({
		queryKey: [INTERFACE_DATA_USE_QUEY_KEY, INPUT_VALUE_USE_QUEY_KEY],
		queryFn: () => {
			return {
				isRequired: narration.isRequiredInput,
				type: narration.inputType,
				currentValue: narration.inputValue,
			}
		},
	});
}

const DIALOGUE_USE_QUEY_KEY = "dialogue_use_quey_key";
export function useQueryDialogue() {
	const { t: tNarration } = useTranslation(["narration"]);

	return useQuery({
		queryKey: [INTERFACE_DATA_USE_QUEY_KEY, DIALOGUE_USE_QUEY_KEY],
		queryFn: () => {
			let dialogue = narration.dialogue
			let newText: string | undefined = dialogue?.text
			let newCharacter: CharacterBaseModel | undefined = undefined
			if (dialogue) {
				newCharacter = dialogue.character ? getCharacterById(dialogue.character) : undefined
				if (!newCharacter && dialogue.character) {
					newCharacter = new CharacterBaseModel(dialogue.character, { name: tNarration(dialogue.character) })
				}
			}
			return {
				text: newText,
				character: newCharacter,
			}
		},
	});
}

const CAN_GO_NEXT_USE_QUEY_KEY = "can_go_next_use_quey_key";
export function useQueryCanGoNext() {
	return useQuery({
		queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CAN_GO_NEXT_USE_QUEY_KEY],
		queryFn: () => {
			return narration.canGoNext && !narration.isRequiredInput
		},
	});
}
