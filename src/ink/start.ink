-> start
INCLUDE second_part.ink

=== start ===
# lazyload bundle m01 fm01 fm02

# show image bg bg01-hallway
# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-neutral01] xAlign 0.5 yAlign 1 with movein direction right ease circInOut type spring
james: You're my roommate's replacement, huh?
# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-smile01]
james: Don't worry, you don't have much to live up to. Just don't use heroin like the last guy, and you'll be fine!
# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-grin00]
mc: ...

He thrusts out his hand.
# request input type string default Peter
What is your name?
# rename mc { _input_value_ }

# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-smile01]
james: [james]!
# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-grin00]
mc: ...[mc].

# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-grin00]
I take his hand and shake.

# show imagecontainer james [m01-body m01-eyes-wow m01-mouth-wow01]
james: Ooh, [mc]! Nice, firm handshake!
# show imagecontainer james [m01-body m01-eyes-annoy m01-mouth-annoy01]
<>The last guy always gave me the dead fish.
# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-smile01]
<>I already think we're gonna get along fine.
# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-smile01]
james: Come on in and...
# show imagecontainer james [m01-body m01-eyes-annoy m01-mouth-smile01]
james: ...
# show imagecontainer james [m01-body m01-eyes-annoy m01-mouth-annoy01]
james: I know you're both watching, come on out already!

# show imagecontainer james [m01-body m01-eyes-annoy m01-mouth-annoy00]
# show imagecontainer sly [fm01-body fm01-eyes-wow fm01-mouth-soft01] xAlign 0.2 yAlign 1 with movein direction right ease anticipate
# show imagecontainer steph [fm02-body fm02-eyes-nervous fm02-mouth-nervous00] xAlign 0.8 yAlign 1 with movein direction left ease easeInOut
sly: I just wanted to see what the new guy was like.
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-smile01]
<><span className="inline-block motion-translate-y-loop-25">Hey</span>, you, [mc]- be nice to our little brother,
# show imagecontainer sly [fm01-body fm01-eyes-smile fm01-mouth-grin00]
<>or you'll have to deal with *us*.
# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-neutral00]
# show imagecontainer sly [fm01-body fm01-eyes-grin fm01-mouth-grin00]
# show imagecontainer steph [fm02-body fm02-eyes-nervous fm02-mouth-smile00]
mc: ...
# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-smile01]
# show imagecontainer sly [fm01-body fm01-eyes-smile fm01-mouth-smile00]
james: [mc], this is [sly].
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-smile00]
# show imagecontainer steph [fm02-body fm02-eyes-joy fm02-mouth-smile00]
<>Yes, that is her real name.

# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-smile00]
I put out my hand.

# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-upset01]
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-nervous00]
sly: I'm not shakin' your hand until I decide you're an all-right dude.
# show imagecontainer sly [fm01-body fm01-eyes-grin fm01-mouth-serious01]
# show imagecontainer steph [fm02-body fm02-eyes-nervous fm02-mouth-nervous00]
<>Sorry, policy.
# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-smile00]
mc: Fair enough, I'm a pretty scary guy, or so I've been told.
# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-smile01]
# show imagecontainer sly [fm01-body fm01-eyes-smile fm01-mouth-serious01]
# show imagecontainer steph [fm02-body fm02-eyes-nervous fm02-mouth-smile00]
james: The redhead behind her is [steph_fullname].
# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-smile fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-joy fm02-mouth-smile01]
steph: Hey! Everyone calls me [steph]. I'll shake your hand.

# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-smile00]
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-smile fm02-mouth-smile00]
		She puts out her hand, and I take it.

# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-nervous00]
mc: Thanks, good to meet you, [steph_fullname].
# show imagecontainer james [m01-body m01-eyes-wow m01-mouth-smile00]
# show imagecontainer sly [fm01-body fm01-eyes-wow fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-wow01]
steph: WOW, that is, like, the most perfect handshake I've ever had! Firm, but also gentle.
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-upset00]
<>[sly], you *gotta* shake his hand!
# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-serious01]
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-nervous00]
sly: It's just a handshake...
# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-upset fm02-mouth-upset01]
steph: <span className="inline-block animate-wave">Then just give it to him!</span>
# show imagecontainer james [m01-body m01-eyes-concern m01-mouth-smile01]
# show imagecontainer sly [fm01-body fm01-eyes-smile fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-upset fm02-mouth-upset00]
james: Don't worry, [mc], she's just giving you the run-down. She's kinda like a father
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-nervous00]
# show imagecontainer sly [fm01-body fm01-eyes-wow fm01-mouth-wow01]
<>...
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-upset00]
<>I mean a mother... to us.

# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-smile00]
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-upset00]
[sly] thrusts her hand out to shake mine.

# show imagecontainer james [m01-body m01-eyes-wow m01-mouth-wow01]
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-upset01]
# show imagecontainer steph [fm02-body fm02-eyes-nervous fm02-mouth-smile00]
sly: Like a father?!?!

# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-upset00]
		I'm afraid to take her hand when she's mad, but I do.

# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-wow fm01-mouth-wow01]
# show imagecontainer steph [fm02-body fm02-eyes-joy fm02-mouth-smile00]
sly: Wow, that was a good handshake...
# show imagecontainer sly [fm01-body fm01-eyes-wow fm01-mouth-serious00]
# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-smile01]
# show imagecontainer steph [fm02-body fm02-eyes-smile fm02-mouth-smile00]
james: Well, I mean, you are *kinda* acting like a father.
# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-smile01]
# show imagecontainer sly [fm01-body fm01-eyes-soft fm01-mouth-serious00]
<>Like, I can totally see it: I'm the daughter, and you as my father,
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-nervous00]
<>you want to make sure I'm going out with the right guy...
# show imagecontainer james [m01-body m01-eyes-concern m01-mouth-smile01]
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-upset00]
<>or something...
# show imagecontainer james [m01-body m01-eyes-concern m01-mouth-grin00]
mc: ...
# show imagecontainer sly [fm01-body fm01-eyes-upset fm01-mouth-upset00]
sly: ...
# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-wow fm01-mouth-wow01]
# show imagecontainer steph [fm02-body fm02-eyes-joy fm02-mouth-smile01]
steph: ...BWAHAHA!!!!!
# show imagecontainer sly [fm01-body fm01-eyes-wow fm01-mouth-serious00]
<>JAMES!!!! WHAAAAT?????? YOU'RE SO AWKWARD!!!!
# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-smile00]
# show imagecontainer sly [fm01-body fm01-eyes-smile fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-joy fm02-mouth-smile00]
mc: O-*kay*, I'm gonna go get settled in-
# show imagecontainer sly [fm01-body fm01-eyes-smile fm01-mouth-smile00]
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-wow01]
steph: Wait!
# show imagecontainer steph [fm02-body fm02-eyes-joy fm02-mouth-smile01]
<>I've got a gift for you!
# show imagecontainer steph [fm02-body fm02-eyes-joy fm02-mouth-smile00]
mc: ...?
# show imagecontainer sly [fm01-body fm01-eyes-grin fm01-mouth-smile01]
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-upset00]
sly: It's food.
# show imagecontainer james [m01-body m01-eyes-concern m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-grin fm01-mouth-grin00]
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-wow01]
steph: [sly]!
# show imagecontainer steph [fm02-body fm02-eyes-upset fm02-mouth-upset01]
<>SPOILERS!!!!

# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-smile fm01-mouth-smile00]
# show imagecontainer steph [fm02-body fm02-eyes-upset fm02-mouth-nervous00]
# remove image steph with moveout direction left ease easeInOut
[steph_fullname] goes through the opposite door,
<- animation_01
<>and returns with a HUGE tinfoil-covered platter.

# show imagecontainer james [m01-body m01-eyes-concern m01-mouth-smile01]
# show imagecontainer sly [fm01-body fm01-eyes-smile fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-wow01]
james: Looks like you baked way too much again.
# show imagecontainer james [m01-body m01-eyes-grin m01-mouth-grin00]
# show imagecontainer sly [fm01-body fm01-eyes-grin fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-upset fm02-mouth-upset01]
steph: He doesn't have to know that!!!
# show imagecontainer james [m01-body m01-eyes-smile m01-mouth-smile00]
# show imagecontainer sly [fm01-body fm01-eyes-smile fm01-mouth-serious00]
# show imagecontainer steph [fm02-body fm02-eyes-joy fm02-mouth-smile00]
mc: ...thanks... um...
# show imagecontainer steph [fm02-body fm02-eyes-wow fm02-mouth-wow01]
steph: Oh! You gotta take in your luggage!

# remove image james with moveout direction right ease circInOut type spring duration 0.5 delay 0.05
# remove image sly with moveout direction right ease anticipate duration 0.5
# remove image steph with moveout direction left ease easeInOut duration 0.5 delay 0.1

You want continue to the next part?<># continue
* Yes, I want to continue
-> second_part
* No, I want to stop here
-> END
