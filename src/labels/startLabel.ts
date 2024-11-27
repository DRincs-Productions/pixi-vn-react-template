import { narration, newLabel, pixivnTestStartLabel } from "@drincs/pixi-vn";

const startLabel = newLabel("start", [
    async (props) => {
        await narration.jumpLabel(pixivnTestStartLabel, props);
    }
]);
export default startLabel;
