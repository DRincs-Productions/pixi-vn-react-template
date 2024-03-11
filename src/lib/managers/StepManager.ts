import { Label } from "../classes/Label"
import { getLabelInstanceByClassName } from "../decorators/LabelDecorator"
import { HistoryLabelEventEnum } from "../enums/LabelEventEnum"
import { convertStepLabelToStepHistoryData } from "../functions/StepLabelUtility"
import { IHistoryLabelEvent } from "../interface/IHistoryLabelEvent"
import { IHistoryStep } from "../interface/IHistoryStep"
import { IOpenedLabel } from "../interface/IOpenedLabel"
import { ExportedStep } from "../interface/export/ExportedStep"
import { LabelTagType } from "../types/LabelTagType"
import { StepHistoryDataType } from "../types/StepHistoryDataType"
import { StepLabelType } from "../types/StepLabelType"
import { GameStorageManager } from "./StorageManager"
import { GameWindowManager } from "./WindowManager"

/**
 * GameHistoryManager is a class that contains the history of the game.
 */
export class GameStepManager {
    private constructor() { }
    /**
     * stepHistory is a list of label events and steps that occurred during the progression of the steps.
     */
    private static stepsHistory: (IHistoryLabelEvent | IHistoryStep)[] = []
    private static openedLabels: IOpenedLabel[] = []
    /**
     * currentLabel is the current label that occurred during the progression of the steps.
     */
    private static get currentLabel(): LabelTagType | null {
        if (GameStepManager.openedLabels.length > 0) {
            return GameStepManager.openedLabels[GameStepManager.openedLabels.length - 1].label
        }
        return null
    }
    /**
     * currentLabelStepIndex is the current step index of the current label that occurred during the progression of the steps.
     */
    private static get currentLabelStepIndex(): number | null {
        if (GameStepManager.openedLabels.length > 0) {
            return GameStepManager.openedLabels[GameStepManager.openedLabels.length - 1].currentStepIndex
        }
        return null
    }

    /* Edit History Methods */

    /**
     * Add a label to the history.
     * @param label The label to add to the history.
     */
    private static addStepHistory(step: StepLabelType) {
        let stepHistory: StepHistoryDataType = convertStepLabelToStepHistoryData(step)
        let historyStep: IHistoryStep = {
            path: window.location.pathname,
            storage: GameStorageManager.export(),
            step: stepHistory,
            canvas: GameWindowManager.export(),
            stepIndex: GameStepManager.currentLabelStepIndex || 0,
        }
        GameStepManager.stepsHistory.push(historyStep)
    }
    /**
     * Add a label to the history.
     * @param label The label to add to the history.
     */
    private static pushNewLabel(label: LabelTagType, type: HistoryLabelEventEnum) {
        let currentLabel = getLabelInstanceByClassName(label)
        if (!currentLabel) {
            throw new Error("Label not found")
        }
        let historyLabel: IHistoryLabelEvent = {
            label: label,
            type: type,
            labelClassName: currentLabel.constructor.name,
        }
        GameStepManager.stepsHistory.push(historyLabel)
        GameStepManager.openedLabels.push({
            label: label,
            currentStepIndex: 0,
        })
    }
    /**
     * Close the current label and add it to the history.
     * @returns 
     */
    private static closeLabel() {
        if (!GameStepManager.currentLabel) {
            console.warn("No label to close")
            return
        }
        let currentLabel = getLabelInstanceByClassName(GameStepManager.currentLabel)
        if (!currentLabel) {
            console.error("Label not found")
            return
        }
        let historyLabel: IHistoryLabelEvent = {
            label: GameStepManager.currentLabel,
            type: HistoryLabelEventEnum.End,
            labelClassName: currentLabel.constructor.name,
        }
        GameStepManager.stepsHistory.push(historyLabel)
        GameStepManager.openedLabels.pop()
    }
    /**
     * Close all labels and add them to the history.
     */
    private static closeAllLabels() {
        while (GameStepManager.openedLabels.length > 0) {
            GameStepManager.closeLabel()
        }
    }

    /* Run Methods */

    /**
     * Execute the next step and add it to the history.
     * @returns
     */
    public static async runNextStep() {
        if (GameStepManager.openedLabels.length === 0) {
            console.error("No openedLabels")
            return
        }
        GameStepManager.openedLabels[GameStepManager.openedLabels.length - 1] = {
            ...GameStepManager.openedLabels[GameStepManager.openedLabels.length - 1],
            currentStepIndex: GameStepManager.openedLabels[GameStepManager.openedLabels.length - 1].currentStepIndex + 1,
        }
        return await GameStepManager.runCurrentStep()
    }
    /**
     * Execute the current step and add it to the history.
     * @returns 
     */
    private static async runCurrentStep() {
        if (GameStepManager.currentLabel) {
            let lasteStepsLength = GameStepManager.currentLabelStepIndex
            if (lasteStepsLength === null) {
                console.error("No lasteStepsLength")
                return
            }
            let currentLabel = getLabelInstanceByClassName(GameStepManager.currentLabel)
            if (!currentLabel) {
                console.error("Label not found")
                return
            }
            let n = currentLabel.steps.length
            if (n > lasteStepsLength) {
                let nextStep = currentLabel.steps[lasteStepsLength]
                await nextStep()
                GameStepManager.addStepHistory(nextStep)
            }
            else if (n === lasteStepsLength) {
                GameStepManager.closeLabel()
                await GameStepManager.runNextStep()
            }
            else {
                console.warn("No next step")
            }
        }
    }
    /**
     * Execute the label and add it to the history.
     * Is a call function in Ren'Py.
     * @param label The label to execute.
     * @returns
     */
    public static async callLabel(label: typeof Label | Label) {
        try {
            if (label instanceof Label) {
                label = label.constructor as typeof Label
            }
            let labelName = label.name
            GameStepManager.pushNewLabel(labelName, HistoryLabelEventEnum.OpenByCall)
        }
        catch (e) {
            console.error(e)
            return
        }
        return await GameStepManager.runCurrentStep()
    }
    /**
     * Execute the label, close all labels and add them to the history.
     * Is a jump function in Ren'Py.
     * @param label 
     */
    public static async jumpLabel(label: typeof Label | Label) {
        GameStepManager.closeAllLabels()
        try {
            if (label instanceof Label) {
                label = label.constructor as typeof Label
            }
            let labelName = label.name
            GameStepManager.pushNewLabel(labelName, HistoryLabelEventEnum.OpenByJump)
        }
        catch (e) {
            console.error(e)
            return
        }
        return await GameStepManager.runCurrentStep()
    }

    /* After Update Methods */

    /**
     * After the update or code edit, some steps or labels may no longer match.
     * - In case of step mismatch, the game will be updated to the last matching step.
     * - In case of label mismatch, the game gives an error.
     * @returns 
     */
    public static afterUpdate() {
        // TODO: implement
        if (!GameStepManager.currentLabel) {
            // TODO: implement
            return
        }
        let currentLabel = getLabelInstanceByClassName(GameStepManager.currentLabel)
        if (!currentLabel) {
            console.error("Label not found")
            return
        }
        let oldSteps = GameStepManager.stepsAfterLastHistoryLabel
        let currentStepIndex = currentLabel.getCorrespondingStepsNumber(oldSteps)
        let stepToRemove = oldSteps.length - currentStepIndex
        GameStepManager.removeLastHistoryNodes(stepToRemove)
        GameStepManager.loadLastStep()
    }
    public static loadLastStep() {
        // TODO: implement
    }
    /**
     * Remove a number of items from the last of the history.
     * @param itemNumber The number of items to remove from the last of the history.
     */
    private static removeLastHistoryNodes(itemNumber: number) {
        // TODO: implement
        for (let i = 0; i < itemNumber; i++) {
            GameStepManager.stepsHistory.pop()
        }
    }
    /**
     * stepsAfterLastHistoryLabel is a list of steps that occurred after the last history label.
     */
    private static get stepsAfterLastHistoryLabel(): StepHistoryDataType[] {
        let length = GameStepManager.stepsHistory.length
        let steps: StepHistoryDataType[] = []
        for (let i = length - 1; i >= 0; i--) {
            let element = GameStepManager.stepsHistory[i]
            if (typeof element === "object" && "step" in element) {
                steps.push(element.step)
            }
            else {
                break
            }
        }

        steps = steps.reverse()
        return steps
    }

    /**
     * Add a label to the history.
     */
    public static clear() {
        GameStepManager.stepsHistory = []
        GameStepManager.openedLabels = []
    }

    /* Export and Import Methods */

    /**
     * Export the history to a JSON string.
     * @returns The history in a JSON string.
     */
    public static exportJson(): string {
        return JSON.stringify(this.export())
    }
    /**
     * Export the history to an object.
     * @returns The history in an object.
     */
    public static export(): ExportedStep {
        return {
            stepsHistory: GameStepManager.stepsHistory,
            openedLabels: GameStepManager.openedLabels,
        }
    }
    /**
     * Import the history from a JSON string.
     * @param dataString The history in a JSON string.
     */
    public static importJson(dataString: string) {
        GameStepManager.import(JSON.parse(dataString))
    }
    /**
     * Import the history from an object.
     * @param data The history in an object.
     */
    public static import(data: object) {
        GameStepManager.clear()
        try {
            if (data.hasOwnProperty("stepsHistory")) {
                GameStepManager.stepsHistory = (data as ExportedStep)["stepsHistory"] as (IHistoryLabelEvent | IHistoryStep)[]
            }
            else {
                console.log("No stepsHistory data found")
            }
            if (data.hasOwnProperty("openedLabels")) {
                GameStepManager.openedLabels = (data as ExportedStep)["openedLabels"] as IOpenedLabel[]
            }
            else {
                console.log("No openedLabels data found")
            }
        }
        catch (e) {
            console.error("Error importing data", e)
        }
    }
}