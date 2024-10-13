import { saveCharacter } from "@drincs/pixi-vn";
import Character from "../models/Character";

export const juliette = new Character('___pixivn_juliette___', {
    name: 'Juliette',
    age: 25,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4eMoz7DH8l_Q-iCzSc1xyu_C2iryWh2O9_FcDBpY04w&s",
    color: "#ac0086"
});

saveCharacter(juliette);
