import {
    Assets,
    moveIn,
    moveOut,
    narration,
    newChoiceOption,
    newCloseChoiceOption,
    newLabel,
    showImage,
    showImageContainer,
} from "@drincs/pixi-vn";
import { james, mc, sly, steph, steph_fullname } from "../values/characters";
import { animation01 } from "./animations-labels";
import secondPart from "./secondPart";

const startLabel = newLabel(
    "start",
    [
        async () => {
            await showImage("bg", "bg01-hallway");
            await moveIn(
                "james",
                {
                    value: ["m01-body", "m01-eyes-smile", "m01-mouth-neutral01"],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "right", ease: "circInOut", type: "spring" }
            );
            narration.dialogue = { character: james, text: `You're my roommate's replacement, huh?` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
            narration.dialogue = {
                character: james,
                text: `Don't worry, you don't have much to live up to. Just don't use heroin like the last guy, and you'll be fine!`,
            };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
            narration.dialogue = { character: mc, text: `...` };
        },
        () => {
            narration.dialogue = `He thrusts out his hand.`;
        },
        async () => {
            narration.requestInput({ type: "string" }, "Peter");
            narration.dialogue = `What is your name?`;
        },
        async () => {
            mc.name = narration.inputValue as string;
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
            narration.dialogue = { character: james, text: `${james.name}!` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
            narration.dialogue = { character: mc, text: `...${mc.name}.` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
            narration.dialogue = `I take his hand and shake.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-wow01"]);
            narration.dialogue = { character: james, text: `Ooh, ${mc.name}! Nice, firm handshake!` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-annoy", "m01-mouth-annoy01"]);
            narration.dialogGlue = true;
            narration.dialogue = `The last guy always gave me the dead fish.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile01"]);
            narration.dialogGlue = true;
            narration.dialogue = `I already think we're gonna get along fine.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
            narration.dialogue = { character: james, text: `Come on in and...` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-annoy", "m01-mouth-smile01"]);
            narration.dialogue = { character: james, text: `...` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-annoy", "m01-mouth-annoy01"]);
            narration.dialogue = { character: james, text: `I know you're both watching, come on out already!` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-annoy", "m01-mouth-annoy00"]);
            await moveIn(
                "sly",
                {
                    value: ["fm01-body", "fm01-eyes-wow", "fm01-mouth-soft01"],
                    options: { xAlign: 0.2, yAlign: 1 },
                },
                { direction: "right", ease: "anticipate" }
            );
            await moveIn(
                "steph",
                {
                    value: ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"],
                    options: { xAlign: 0.8, yAlign: 1 },
                },
                { direction: "left", ease: "easeInOut" }
            );
            narration.dialogue = { character: sly, text: `I just wanted to see what the new guy was like.` };
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-smile01"]);
            narration.dialogGlue = true;
            narration.dialogue = `<span class="inline-block motion-translate-y-loop-25">Hey</span>, you, ${mc.name}- be nice to our little brother,`;
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-grin00"]);
            narration.dialogGlue = true;
            narration.dialogue = `or you'll have to deal with *us*.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-grin00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
            narration.dialogue = { character: mc, text: `...` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile01"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
            narration.dialogue = { character: james, text: `${mc.name}, this is ${sly.name}.` };
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-smile00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
            narration.dialogGlue = true;
            narration.dialogue = `Yes, that is her real name.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile00"]);
            narration.dialogue = `I put out my hand.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset01"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
            narration.dialogue = {
                character: sly,
                text: `I'm not shakin' your hand until I decide you're an all-right dude.`,
            };
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-serious01"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
            narration.dialogGlue = true;
            narration.dialogue = `Sorry, policy.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-smile00"]);
            narration.dialogue = { character: mc, text: `Fair enough, I'm a pretty scary guy, or so I've been told.` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile01"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
            narration.dialogue = { character: james, text: `The redhead behind her is ${steph_fullname}.` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
            narration.dialogue = {
                character: steph,
                text: `Hey! Everyone calls me ${steph.name}. I'll shake your hand.`,
            };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-smile00"]);
            narration.dialogue = `She puts out her hand, and I take it.`;
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
            narration.dialogue = { character: mc, text: `Thanks, good to meet you, ${steph_fullname}.` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-smile00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
            narration.dialogue = {
                character: steph,
                text: `WOW, that is, like, the most perfect handshake I've ever had! Firm, but also gentle.`,
            };
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset00"]);
            narration.dialogGlue = true;
            narration.dialogue = `${sly.name}, you *gotta* shake his hand!`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious01"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
            narration.dialogue = { character: sly, text: `It's just a handshake...` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset01"]);
            narration.dialogue = {
                character: steph,
                text: `<span class="inline-block animate-wave">Then just give it to him!</span>`,
            };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-smile01"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset00"]);
            narration.dialogue = {
                character: james,
                text: `Don't worry, ${mc.name}, she's just giving you the run-down. She's kinda like a father`,
            };
        },
        async () => {
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-wow01"]);
            narration.dialogGlue = true;
            narration.dialogue = `...`;
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset00"]);
            narration.dialogGlue = true;
            narration.dialogue = `I mean a mother... to us.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset00"]);
            narration.dialogue = `${sly.name} thrusts her hand out to shake mine.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-wow01"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset01"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
            narration.dialogue = { character: sly, text: `Like a father?!?!` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset00"]);
            narration.dialogue = `I'm afraid to take her hand when she's mad, but I do.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-wow01"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
            narration.dialogue = { character: sly, text: `Wow, that was a good handshake...` };
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious00"]);
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-smile00"]);
            narration.dialogue = { character: james, text: `Well, I mean, you are *kinda* acting like a father.` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile01"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-soft", "fm01-mouth-serious00"]);
            narration.dialogGlue = true;
            narration.dialogue = `Like, I can totally see it: I'm the daughter, and you as my father,`;
        },
        async () => {
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
            narration.dialogGlue = true;
            narration.dialogue = `you want to make sure I'm going out with the right guy...`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-smile01"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-upset00"]);
            narration.dialogGlue = true;
            narration.dialogue = `or something...`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-grin00"]);
            narration.dialogue = { character: mc, text: `...` };
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset00"]);
            narration.dialogue = { character: sly, text: `...` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-wow01"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
            narration.dialogue = { character: steph, text: `...BWAHAHA!!!!!` };
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious00"]);
            narration.dialogGlue = true;
            narration.dialogue = `JAMES!!!! WHAAAAT?????? YOU'RE SO AWKWARD!!!!`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
            narration.dialogue = { character: mc, text: `O-*kay*, I'm gonna go get settled in-` };
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
            narration.dialogue = { character: steph, text: `Wait!` };
        },
        async () => {
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
            narration.dialogGlue = true;
            narration.dialogue = `I've got a gift for you!`;
        },
        async () => {
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
            narration.dialogue = { character: mc, text: `...?` };
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-smile01"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-upset00"]);
            narration.dialogue = { character: sly, text: `It's food.` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-grin00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
            narration.dialogue = { character: steph, text: `${sly.name}!` };
        },
        async () => {
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset01"]);
            narration.dialogGlue = true;
            narration.dialogue = `SPOILERS!!!!`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-nervous00"]);
            moveOut("steph", { direction: "left", ease: "easeInOut" });
            narration.dialogue = `${steph_fullname} goes through the opposite door,`;
        },
        async (props) => {
            narration.dialogGlue = true;
            narration.dialogue = `and returns with a HUGE tinfoil-covered platter.`;
            await narration.call(animation01, props);
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-smile01"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
            narration.dialogue = { character: james, text: `Looks like you baked way too much again.` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset01"]);
            narration.dialogue = { character: steph, text: `He doesn't have to know that!!!` };
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
            narration.dialogue = { character: mc, text: `...thanks... um...` };
        },
        async () => {
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
            narration.dialogue = { character: steph, text: `Oh! You gotta take in your luggage!` };
        },
        async () => {
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-smile00"]);
            moveOut("james", { direction: "right", ease: "circInOut", type: "spring", duration: 0.5, delay: 0.05 });
            moveOut("sly", { direction: "right", ease: "anticipate", duration: 0.5 });
            moveOut("steph", { direction: "left", ease: "easeInOut", duration: 0.5, delay: 0.1 });
            narration.dialogue = `You want continue to the next part?`;
            narration.choices = [
                newChoiceOption("Yes, I want to continue", secondPart, {}, { type: "jump" }),
                newCloseChoiceOption("No, I want to stop here"),
            ];
        },
    ],
    {
        onLoadingLabel: () => {
            Assets.backgroundLoadBundle(["fm01", "fm02", "m01"]);
        },
    }
);
export default startLabel;
