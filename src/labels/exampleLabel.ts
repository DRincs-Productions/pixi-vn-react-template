import { newLabel } from "@drincs/pixi-vn";

const exampleLabel = newLabel("example", [
    async (_props) => {
        console.log("Hello, world!");
    }
]);
export default exampleLabel;
