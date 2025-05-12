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
import { james, mc, sly, steph } from "../values/characters";
import { animation01 } from "./animations-labels";

const steph_fullname = "Stephanie";

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
                { direction: "right", speed: 300 }
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
            narration.dialogue = ` The last guy always gave me the dead fish.`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile01"]);
            narration.dialogGlue = true;
            narration.dialogue = ` I already think we're gonna get along fine.`;
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
                { direction: "right", speed: 300 }
            );
            await moveIn(
                "steph",
                {
                    value: ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"],
                    options: { xAlign: 0.8, yAlign: 1 },
                },
                { direction: "left", speed: 300 }
            );
            narration.dialogue = { character: sly, text: `I just wanted to see what the new guy was like.` };
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-smile01"]);
            narration.dialogGlue = true;
            narration.dialogue = ` Hey, you, ${mc.name}- be nice to our little brother,`;
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-grin00"]);
            narration.dialogGlue = true;
            narration.dialogue = ` or you'll have to deal with *us*.`;
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
            narration.dialogue = ` Yes, that is her real name.`;
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
            narration.dialogue = ` Sorry, policy.`;
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
            narration.dialogue = ` ${sly.name}, you *gotta* shake his hand!`;
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
            narration.dialogue = { character: steph, text: `Then just give it to him!` };
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
            narration.dialogue = ` ...`;
        },
        async () => {
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset00"]);
            narration.dialogGlue = true;
            narration.dialogue = ` I mean a mother... to us.`;
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
            narration.dialogue = ` Like, I can totally see it: I'm the daughter, and you as my father,`;
        },
        async () => {
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
            narration.dialogGlue = true;
            narration.dialogue = ` you want to make sure I'm going out with the right guy...`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-smile01"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-upset00"]);
            narration.dialogGlue = true;
            narration.dialogue = ` or something...`;
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
            narration.dialogue = ` JAMES!!!! WHAAAAT?????? YOU'RE SO AWKWARD!!!!`;
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
            narration.dialogue = ` I've got a gift for you!`;
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
            narration.dialogue = ` SPOILERS!!!!`;
        },
        async () => {
            await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
            await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
            await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-nervous00"]);
            moveOut("steph", { direction: "left", speed: 300 });
            narration.dialogue = `${steph_fullname} goes through the opposite door,`;
        },
        async (props) => {
            narration.dialogGlue = true;
            narration.dialogue = ` and returns with a HUGE tinfoil-covered platter.`;
            await narration.callLabel(animation01, props);
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
            narration.dialogue = `You want continue to the next part?`;
            narration.choiceMenuOptions = [
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

export const secondPart = newLabel("second_part", [
    async () => {
        await showImage("bg", "bg02-dorm");
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = `She enters my room before I'VE even had a chance to.`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
        narration.dialogGlue = true;
        narration.dialogue = `  \n\n...I could've just come back and gotten the platter later...`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
        narration.dialogue = `She sets it on a desk. I throw my two paper bags down beside the empty bed.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
        narration.dialogue = { character: steph, text: `They got you a new mattress, right?` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous01"]);
        narration.dialogGlue = true;
        narration.dialogue = ` That last guy was a druggie, did ${james.name} tell you that?`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: sly, text: `*We're* the reason he got expelled!` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-grin00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-upset01"]);
        narration.dialogue = { character: steph, text: `${sly.name}! If word gets out about that...` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-grin00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-nervous01"]);
        narration.dialogGlue = true;
        narration.dialogue = ` well, actually, it wouldn't matter, *he's* the one who shot himself up.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
        narration.dialogue = `I'm fumbling for a new subject.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `So, you're all family?` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        narration.dialogue = `I realize too late`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` this topic is no better:`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
        narration.dialogue = { character: sly, text: `Adopted family.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
        narration.dialogue = {
            character: steph,
            text: `${sly.name} and I were best friends growing up and ${james.name} here needed a mama, so ${sly.name} adopted him!`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-smile00"]);
        narration.dialogue = { character: james, text: `We're not actually related.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset00"]);
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
        narration.dialogue = {
            character: james,
            text: `Yeah, I like to say that this last semester I was in *foster care*`,
        };
    },
    async () => {
        narration.dialogGlue = true;
        narration.dialogue = `  and ${sly.name} picked me up somewhere in there.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-annoy", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile01"]);
        narration.dialogue = { character: sly, text: `${james.name} is just a baby. A freshman like you!` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-annoy", "m01-mouth-annoy01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: james, text: `And *you're* just a sophomore!` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-wow01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-wow01"]);
        narration.dialogue = {
            character: sly,
            text: `I went to medical school for two years before coming here, I think that counts as *at least* 6 years!`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-upset00"]);
        narration.dialogue = `I'm dizzy, and my blood's rushing.`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `Um... why did you switch degrees?` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: sly, text: `My mom was all in the medical field,` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-smile00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` and since I'm great with kids- I had 6-`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-neutral01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-upset01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: james, text: `They were actually her siblings.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: sly, text: `Yeah, whatever.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` I tried it because I thought I'd love it,`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-upset01"]);
        narration.dialogGlue = true;
        narration.dialogue = ` but I HATED it!`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` When we started getting into anatomy, I realized how *gross* the whole thing is. I changed diapers,`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-annoy00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` but that's a little different from changing *livers*, know what I mean?`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-annoy00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-smile00"]);
        narration.dialogue = { character: sly, text: `So I'm trying out architecture now.` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile01"]);
        narration.dialogGlue = true;
        narration.dialogue = ` What are you going for, ${mc.name}?`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `...uh... ...just getting my Gen Eds out of the way right now...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
        narration.dialogue = { character: sly, text: `Why not do that at a community college?` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile01"]);
        narration.dialogue = { character: steph, text: `Did you get a full ride or something?` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
        narration.dialogue = { character: mc, text: `...yeah...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = `I knew this wouldn't go anywhere good.`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile01"]);
        narration.dialogue = { character: sly, text: `Are you going to go visit your parents on the weekend?` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        narration.dialogue = { character: mc, text: `... .... ..` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` .... ..... ..... ... ... ..`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
        narration.dialogue = { character: james, text: `It's no worry if you don't,` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` mine drive me crazy so I stay here.`;
    },
    async () => {
        // let slyImage = await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"])
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
        narration.dialogue = {
            character: sly,
            text: `You've gotta live close by, right? Nobody comes to this college from afar, sorry, we're just not that hot of a scene.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        narration.dialogue = { character: mc, text: `... ... .. . . ..` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` .. . ......... ... . ... .. .... ... .. . .`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` . ...... . . . . .. .. ..  .... .`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` ...`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile01"]);
        narration.dialogue = {
            character: sly,
            text: `Or maybe they'll come to visit you? My siblings will do that sometimes. It's quite a sight to have all 6 of them running around here, but everyone's pretty chill about it and I trust pretty much everyone here.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-annoy", "m01-mouth-annoy01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        narration.dialogue = { character: james, text: `At least, now that *Sven's*` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-upset00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` gone.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-annoy00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-upset01"]);
        narration.dialogue = { character: steph, text: `${james.name}! You don't have to refer to him by name!!` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-upset00"]);
        narration.dialogue = { character: james, text: `Why? ${mc.name}'ll never meet him.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-nervous01"]);
        narration.dialogue = { character: steph, text: `Say, ${mc.name}, where's the rest of your luggage?` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
        narration.dialogue = { character: james, text: `Is that all your luggage?` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-neutral01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-upset00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` Man, that sucks.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `So... um... what are you going for, ${steph_fullname}?` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        narration.dialogue = { character: steph, text: `Oh,` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` me?`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = `I shouldn't have asked her. I shouldn't have directed a question at her. She reminds me too much...`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
        narration.dialogue = { character: steph, text: `I'm going for childhood education!` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` Actually just have 1 more class; it wasn't available previous semester, so now I've got to take it this one!`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-smile01"]);
        narration.dialogue = {
            character: steph,
            text: `I'm honestly surprised my parents are bothering to pay for me to stay in the dorms right now, but both of them want me to get the *"college experience"*.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile01"]);
        narration.dialogue = { character: steph, text: `I think I've had plenty of it already, though.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: sly, text: `Hey, *I* wouldn't let you go anyway.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-grin00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-nervous01"]);
        narration.dialogue = { character: steph, text: `...we'd see each other still.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-upset00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: james, text: `I'm going for computer science.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `Oh, cool! You like computers?` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-upset00"]);
        narration.dialogue = {
            character: james,
            text: `Yeah, I used to use MS Paint all the time. Now I want to step up my game.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-concern01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-upset00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset00"]);
        narration.dialogue = {
            character: james,
            text: `I also installed Windows once. I just think computer skills are important.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-smile01"]);
        narration.dialogue = {
            character: sly,
            text: `${steph.name} and I are placing bets whether or not he'll switch degrees once he gets into the *real* classes. \n\nHe's still just taking Gen Eds, so we won't know for at least another semester.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        narration.dialogue = {
            character: james,
            text: `Haha, ${sly.name} thinks I made a rash decision, but I think computers are what I wanna do with my life.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset01"]);
        narration.dialogue = {
            character: steph,
            text: `${james.name}, you gotta figure out what you want to *do* in computers. You're not seeing the trees for the forest.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset00"]);
        narration.dialogue = { character: james, text: `...I think you said that wrong.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset01"]);
        narration.dialogue = {
            character: steph,
            text: `No, you're always looking at these big ideas and ignoring the actual *reality* of things! Computer Science isn't just an easy degree either. I'm worried these classes are going to kill you!`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset00"]);
        narration.dialogue = { character: james, text: `I'll be fine!` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-neutral00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset01"]);
        narration.dialogue = { character: steph, text: `Death.` };
    },
    async () => {
        // let stephImage = await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset00"])
        await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-neutral01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: james, text: `...hey ${mc.name}, are you okay?` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-neutral00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `So, what snacks did you bring?` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-neutral00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
        narration.dialogue = { character: steph, text: `Oh!` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
        narration.dialogue = `She opens the tray. Inside are cookies, brownies, candies, a pie, cake pieces...`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` ${james.name} quickly grabs a few.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile01"]);
        narration.dialogGlue = true;
        narration.dialogue = ` ${sly.name} takes some too.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        narration.dialogue = { character: mc, text: `How do you bake all this?!` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
        narration.dialogue = {
            character: steph,
            text: `Baking helps me relax. It's really no work for me, and it's a good way to unwind!`,
        };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-smile00"]);
        narration.dialogue = { character: mc, text: `...I had to do all the cooking as a kid.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogue = `...did I just let that slip?`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
        narration.dialogue = { character: steph, text: `Awesome!` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` Maybe we can swap recipes sometime!`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
        narration.dialogue = { character: mc, text: `I can do... I don't need... I mean...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: james, text: `"You can do?" Is that what the kids are saying today?` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
        narration.dialogue = { character: sly, text: `${james.name}, you *are* a kid!` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-annoy", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-grin00"]);
        narration.dialogue = { character: james, text: `${sly.name}, I am so out of the loop!` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
        narration.dialogue = {
            character: sly,
            text: `Well, then, ${mc.name}, we'll have to try out your cooking someday!`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
        narration.dialogue = { character: steph, text: `Oh!` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-smile01"]);
        narration.dialogGlue = true;
        narration.dialogue = ` If you want...`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` you can even come over today!`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
        narration.dialogGlue = true;
        narration.dialogue = ` You'll be surprised what you can make in a dorm with some know-how and tricks!`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-smile01"]);
        narration.dialogGlue = true;
        narration.dialogue = ` *Did you know you can make cake in a microwave?!?!*`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
        narration.dialogue = `They can see I'm stressing out. I push it all down.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: sly, text: `...It's fine to be scared.` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        narration.dialogue = { character: mc, text: `?!` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious01"]);
        narration.dialogue = {
            character: sly,
            text: `I know you're an adult now, but it's okay to be scared. You don't have to feel ashamed of feeling. It's okay to feel.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-nervous00"]);
        narration.dialogue = `...they have no idea. But I'm glad.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-grin00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
        narration.dialogue = { character: sly, text: `...that's right.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-smile00"]);
        narration.dialogue = { character: james, text: `...who told you you're a scary guy, ${mc.name}?` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-smile00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` You don't seem scary at all.`;
    },
    () => {
        narration.dialogue = { character: mc, text: `My mom.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = `I just said that.`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` Why?`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        narration.dialogue = `Crap. Crap crap crap. Why am I crying?`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous01"]);
        narration.dialogue = { character: steph, text: `Are you okay?` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = `${sly.name} comes over and sits down beside me. She locks eyes with me.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-concern00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: sly, text: `...why are you scary?` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-annoy00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: sly, text: `Is that why your parents sent you here?` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-annoy01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        narration.dialogue = { character: james, text: `${sly.name}!` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-neutral00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-concern00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous01"]);
        narration.dialogue = {
            character: steph,
            text: `...I can't imagine being told by your own *mother* you're scary.`,
        };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-concern00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-nervous01"]);
        narration.dialogue = { character: steph, text: `...but if you really *were*, I suspect you wouldn't be here.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-smile01"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-upset00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-smile00"]);
        narration.dialogue = { character: james, text: `...Right?` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogue = `...I want to run. But I don't know this place; there's nowhere *to* run. And I can't lose this room... So the best I can do is make *them* run.`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = `By telling them the truth.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        narration.dialogue = { character: mc, text: `...I'm the reason...` };
    },
    () => {
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-neutral00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        narration.dialogue = `If I tell them the truth, they'll leave me alone.`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogue = `...and I won't risk hurting any of *them* too.`;
    },
    () => {
        narration.dialogue = { character: mc, text: `...Mom committed suicide because of me...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-concern00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
        narration.dialogue = `...`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = `...why don't they leave?`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-concern00"]);
        narration.dialogue = `That's right, ${sly.name}'s looking out for ${james.name}.`;
    },
    () => {
        narration.dialogue = `If I don't share *everything* now, she's going to get me framed for something and I won't have a place to live anymore.`;
    },
    () => {
        narration.dialogue = { character: mc, text: `...she was...` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-concern00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogue = `They just look at me sadly.`;
    },
    () => {
        narration.dialogue = { character: mc, text: `...addicted to heroin and I couldn't tell *anyone*.` };
    },
    () => {
        narration.dialogue = { character: mc, text: `...told me she'd gut me like a pig if I did.` };
    },
    () => {
        narration.dialogue = { character: mc, text: `I recommended to her...` };
    },
    () => {
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        narration.dialogue = {
            character: mc,
            text: `...I recommend to her "why don't you end this?" I told her I *hated* her.`,
        };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` *And* what she did to my little sister...`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-concern00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-upset00"]);
        narration.dialogue = `Crap, now I look like the villain again. But I *am*. Aren't I?`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset00"]);
        narration.dialogue = {
            character: mc,
            text: `...she sold all of my sister's dolls, toys, school supplies, for dirt cheap just to try to get another fix. She started stealing; she got in with the wrong crowd. She wanted out.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-concern", "m01-mouth-concern00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = {
            character: mc,
            text: `The police were coming though, because... because I called them. Because mean people were coming to hurt Mom.`,
        };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `She couldn't have that. I'd just royally` };
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
        narration.dialogGlue = true;
        narration.dialogue = ` $%*@!& up, and`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` she threatened to *kill* me, but... she couldn't bring herself to do it.`;
    },
    () => {
        narration.dialogue = { character: mc, text: `She had a few days' supply of heroin. She...` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-concern00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
        narration.dialogGlue = true;
        narration.dialogue = ` she took it all at once.`;
    },
    async () => {
        // let stephImage = await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"])
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-wow01"]);
        narration.dialogue = {
            character: mc,
            text: `Locked herself in her room. Screamed at me, "You hate me anyway!" and wouldn't stop screaming it, even though I begged her to come out.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-wow", "m01-mouth-cry00"]);
        narration.dialogue = { character: mc, text: `Those were the last words I heard from her.` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = {
            character: mc,
            text: `My sister and I were taken to be put into foster care. We were told we would be together,`,
        };
    },
    async () => {
        narration.dialogGlue = true;
        narration.dialogue = ` but we were put into separate homes.`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = {
            character: mc,
            text: `...nobody wanted to adopt me; I was 15 at the time my mom killed herself. Teens don't get adopted.`,
        };
    },
    () => {
        narration.dialogue = {
            character: mc,
            text: `And when the first potential couple came in and heard about my story, they blamed`,
        };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-nervous00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` me for everything-`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-upset", "fm02-mouth-upset00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` called me a "demon spawn"- and left`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-wow", "fm01-mouth-serious00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` in a huff.`;
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-serious00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-upset00"]);
        narration.dialogue = { character: mc, text: `...I never got another chance.` };
    },
    () => {
        narration.dialogue = {
            character: mc,
            text: `I only have a place to live here now because I was a good student. But who knows about next semester, or next year? Or once I graduate?`,
        };
    },
    () => {
        narration.dialogue = {
            character: mc,
            text: `I'm amazed that I got a room at all; just two weeks ago they said there was *nothing*.`,
        };
    },
    () => {
        narration.dialogue = { character: mc, text: `...so there. Have I finally scared you away?` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-cry", "m01-mouth-cry00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-soft", "fm01-mouth-soft00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-bawl", "fm02-mouth-cry01"]);
        narration.dialogue = { character: mc, text: `I don't want to look at any of them.` };
    },
    () => {
        narration.dialogue = { character: mc, text: `A hand gently rubs my back.` };
    },
    () => {
        narration.dialogue = { character: sly, text: `You don't really want us to leave, do you?` };
    },
    () => {
        narration.dialogue = { character: mc, text: `?!?!` };
    },
    () => {
        narration.dialogue = { character: sly, text: `...` };
    },
    () => {
        narration.dialogue = {
            character: sly,
            text: `...because if you're willing to be honest about whether you want to be here with us or alone elsewhere, *we're* willing to help you either way.`,
        };
    },
    () => {
        narration.dialogue = { character: sly, text: `It wasn't your fault.` };
    },
    () => {
        narration.dialogue = `I burst out crying.`;
    },
    () => {
        narration.dialogue = { character: mc, text: `...I look like such an idiot.` };
    },
    () => {
        narration.dialogue = {
            character: sly,
            text: `No you don't. And you probably saved your *and* your little sister's lives. If the people coming for your mom had gotten to your house, who *knows* what they would have done to you both.`,
        };
    },
    () => {
        narration.dialogue = `I can't stop.`;
    },
    () => {
        narration.dialogue = { character: steph, text: `You did the best you knew how.` };
    },
    () => {
        narration.dialogue = `I feel a tissue press against my hands. I suddenly realize that snot is dripping through my fingers. Gross.`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-cry", "m01-mouth-smile01"]);
        narration.dialogue = {
            character: james,
            text: `I cried for like a week when I first came. These two are champs, don't worry about it.`,
        };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-cry", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-soft", "fm01-mouth-soft01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-bawl", "fm02-mouth-cry01"]);
        narration.dialogue = { character: sly, text: `So, be honest with us right now.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-cry", "m01-mouth-neutral00"]);
        narration.dialogGlue = true;
        narration.dialogue = ` *Do you* want to stick around us for a while? Or, do you truly want to be left alone? Because we're all willing to deal with this "very dangerous" person.`;
    },
    async () => {
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-bawl", "fm02-mouth-nervous01"]);
        narration.dialogue = { character: sly, text: `Will you be honest with your feelings and with us?` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-soft", "fm01-mouth-soft00"]);
        narration.dialogue = { character: mc, text: `...yes.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-cry", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-soft", "fm01-mouth-soft01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-bawl", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: sly, text: `Are you willing to try being a friend and having friends?` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-soft", "fm01-mouth-soft00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-nervous", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: mc, text: `...` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-upset", "fm01-mouth-soft01"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-wow", "fm02-mouth-nervous00"]);
        narration.dialogue = { character: sly, text: `Because I'm willing to give you a shot.` };
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-grin", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-smile", "fm01-mouth-soft00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-smile", "fm02-mouth-smile00"]);
        narration.dialogue = { character: mc, text: `...absolutely.` };
    },
    async () => {
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-soft", "fm01-mouth-soft00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile00"]);
        narration.dialogue = `I feel lighter. A wave of something I'm not sure I've ever felt washes over me.`;
    },
    () => {
        narration.dialogue = `It's peace; it's rest; it's something different.`;
    },
    () => {
        narration.dialogue = `Like, even though it'll be hard, maybe I could actually be open here.`;
    },
    () => {
        narration.dialogue = `I think this is the beginning of what people call...`;
    },
    async () => {
        await showImageContainer("james", ["m01-body", "m01-eyes-smile", "m01-mouth-smile00"]);
        await showImageContainer("sly", ["fm01-body", "fm01-eyes-grin", "fm01-mouth-grin00"]);
        await showImageContainer("steph", ["fm02-body", "fm02-eyes-joy", "fm02-mouth-smile01"]);
        narration.dialogue = `...freedom...`;
    },
]);
