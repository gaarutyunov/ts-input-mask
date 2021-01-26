import {State} from '../state';
import {Next} from '../next';
import '../../util/string';
import {isNull} from '../../util/isNull';

export class OptionalValueState extends State {

    constructor(
        readonly child: State,
        readonly type: OptionalValueState.StateType
    ) {
        super(child);
    }

    public accept(character: string): Next | null {
        if (this.accepts(character)) {
            return new Next(
                this.nextState(),
                character,
                true,
                character
            );
        } else {
            return new Next(
                this.nextState(),
                null,
                false,
                null
            );
        }
    }

    public toString(): string {
        const type = this.type;
        if (type instanceof OptionalValueState.Numeric) {
            return '[a] -> ' + (!isNull<State>(this.child) ? this.child.toString() : 'null');
        } else if (type instanceof OptionalValueState.Literal) {
            return '[9] -> ' + (!isNull<State>(this.child) ? this.child.toString() : 'null');
        } else if (type instanceof OptionalValueState.AlphaNumeric) {
            return '[-] -> ' + (!isNull<State>(this.child) ? this.child.toString() : 'null');
        } else if (type instanceof OptionalValueState.Custom) {
            return `[${type.character}] -> ` + (!isNull<State>(this.child) ? this.child.toString() : 'null');
        } else {
            throw new Error("Doesn't match any supported type");
        }
    }

    private accepts(character: string): boolean | never {
        const type = this.type;
        if (type instanceof OptionalValueState.Numeric) {
            return character.isDigit();
        } else if (type instanceof OptionalValueState.Literal) {
            return character.isLetter();
        } else if (type instanceof OptionalValueState.AlphaNumeric) {
            return character.isLetterOrDigit();
        } else if (type instanceof OptionalValueState.Custom) {
            return type.characterSet.includes(character);
        } else {
            throw new Error("Doesn't match any supported type");
        }
    }
}

export namespace OptionalValueState {
    export class StateType {
    }

    export class Literal extends StateType {
    }

    export class Numeric extends StateType {
    }

    export class AlphaNumeric extends StateType {
    }

    export class Ellipsis extends StateType {
        public constructor(
            readonly inheritedType: StateType
        ) {
            super();
        }
    }

    export class Custom extends StateType {
        public constructor(
            readonly character: string,
            readonly characterSet: string[]
        ) {
            super();
        }
    }
}
