import {State} from '../state';
import {Next} from '../next';
import '../../util/string';
import {isNull} from '../../util/isNull';

export class ValueState extends State {

    readonly isElliptical: boolean;

    public constructor(
        readonly child: State | null,
        readonly type: ValueState.StateType
    ) {
        super(child);
        this.isElliptical = type instanceof ValueState.Ellipsis;
    }

    public accept(character: String): Next | null {
        if (!this.accepts(character)) {
            return null;
        }

        return new Next(
            this.nextState(),
            character,
            true,
            character
        );
    }

    public nextState(): State | never {
        if (this.type instanceof ValueState.Ellipsis) {
            return this;
        } else {
            return super.nextState();
        }
    }

    public toString(): String {
        const type = this.type;
        if (type instanceof ValueState.Numeric) {
            return "[A] -> " + (!isNull<State>(this.child) ? this.child.toString() : "null");
        } else if (type instanceof ValueState.Literal) {
            return "[0] -> " + (!isNull<State>(this.child) ? this.child.toString() : "null");
        } else if (type instanceof ValueState.AlphaNumeric) {
            return "[_] -> " + (!isNull<State>(this.child) ? this.child.toString() : "null");
        } else if (type instanceof ValueState.Ellipsis) {
            return "[...] -> " + (!isNull<State>(this.child) ? this.child.toString() : "null");
        } else if (type instanceof ValueState.Custom) {
            return `[${type.character}] -> ` + (!isNull<State>(this.child) ? this.child.toString() : "null");
        } else {
            throw new Error("Doesn't match any supported type");
        }
    }

    private accepts(character: String): boolean | never {
        const type = this.type;
        if (type instanceof ValueState.Numeric) {
            return character.isDigit();
        } else if (type instanceof ValueState.Literal) {
            return character.isLetter();
        } else if (type instanceof ValueState.AlphaNumeric) {
            return character.isLetterOrDigit();
        } else if (type instanceof ValueState.Ellipsis) {
            if (type instanceof ValueState.Numeric) {
                return character.isDigit();
            } else if (type instanceof ValueState.Literal) {
                return character.isLetter();
            } else if (type instanceof ValueState.AlphaNumeric) {
                return character.isLetterOrDigit();
            } else {
                return false;
            }
        } else if (type instanceof ValueState.Custom) {
            return type.characterSet.contains(character);
        } else {
            throw new Error("Doesn't match any supported type");
        }
    }
}

export module ValueState {
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
            readonly character: String,
            readonly characterSet: String,
        ) {
            super();
        }
    }
}
