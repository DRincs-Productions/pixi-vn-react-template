import { canvas, ImageContainer, moveIn, newLabel } from "@drincs/pixi-vn";

export const animation01 = newLabel("animation_01", [
    async () => {
        let tickerId = canvas.animate<ImageContainer>(
            "steph",
            {
                scaleX: 1,
            },
            { autoplay: false, forceCompleteBeforeNext: true }
        );

        await moveIn(
            "steph",
            {
                value: ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"],
                options: { xAlign: 0.8, yAlign: 1, scale: { y: 1, x: -1 }, anchor: 0.5 },
            },
            { direction: "right", ease: "easeInOut", tickerIdToResume: tickerId }
        );
    },
]);
