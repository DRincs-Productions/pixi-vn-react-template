import { CharacterInterface, CharacterStoredClass } from "@drincs/pixi-vn";

export default class Character extends CharacterStoredClass implements CharacterInterface {
    /**
     * @param id The id of the character.
     * @param props The properties of the character.
     */
    constructor(id: string | { id: string; emotion: string }, props: CharacterProps) {
        super(typeof id === "string" ? id : id.id, typeof id === "string" ? "" : id.emotion);
        this.defaultName = props.name;
        this.defaultSurname = props.surname;
        this.defaultAge = props.age;
        this.icon = props.icon;
        this.color = props.color;
    }
    private defaultName?: string;
    get name(): string {
        return this.getStorageProperty<string>("name") || this.defaultName || this.id;
    }
    set name(value: string | undefined) {
        this.setStorageProperty<string>("name", value);
    }
    private defaultSurname?: string;
    get surname(): string | undefined {
        return this.getStorageProperty<string>("surname") || this.defaultSurname;
    }
    set surname(value: string | undefined) {
        this.setStorageProperty<string>("surname", value);
    }
    private defaultAge?: number | undefined;
    get age(): number | undefined {
        return this.getStorageProperty<number>("age") || this.defaultAge;
    }
    set age(value: number | undefined) {
        this.setStorageProperty<number>("age", value);
    }
    readonly icon?: string;
    readonly color?: string | undefined;
}

interface CharacterProps {
    /**
     * The name of the character.
     */
    name?: string;
    /**
     * The surname of the character.
     */
    surname?: string;
    /**
     * The age of the character.
     */
    age?: number;
    /**
     * The icon of the character.
     */
    icon?: string;
    /**
     * The color of the character.
     */
    color?: string;
}
