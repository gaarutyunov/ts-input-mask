import {
    CaretString,
    EOLState,
    FixedState,
    FreeState,
    Next,
    Notation,
    OptionalValueState,
    State,
    ValueState
} from '../model';
import {Compiler} from './compiler';
import {CaretStringIterator} from './caret-string-iterator';

export class Mask {
    private readonly initialState: State = new Compiler(this.customNotations).compile(this.format);
    static readonly cache: Map<String, Mask> = new Map();

    static getOrCreate(format: String, customNotations: ReadonlyArray<Notation>): Mask {
        let cachedMask: Mask | undefined = Mask.cache.get(format);
        if (!cachedMask) {
            cachedMask = new Mask(format, customNotations);
            Mask.cache.set(format, cachedMask);
        }
        return cachedMask;
    }

    constructor(
        readonly format: String,
        readonly customNotations?: ReadonlyArray<Notation>
    ) {
    }

    static isValid(format: String, customNotations: ReadonlyArray<Notation>): boolean {
        try {
            new Mask(format, customNotations);
            return true;
        } catch (e) {
            return false;
        }
    }

    public apply(text: CaretString, autocomplete: Boolean): Mask.Result {
        const iterator = new CaretStringIterator(text);

        let affinity = 0;
        let extractedValue = '';
        let modifiedString = '';
        let modifiedCaretPosition: number = text.caretPosition;

        let state: State = this.initialState;
        let beforeCaret: boolean = iterator.beforeCaret();
        let character: String | null = iterator.next();
        let next: Next;

        while (!!character) {
            next = state.accept(character);
            if (!!next) {
                state = next.state;
                modifiedString += !!next.insert ? next.insert : '';
                extractedValue += !!next.value ? next.value : '';
                if (next.pass) {
                    beforeCaret = iterator.beforeCaret();
                    character = iterator.next();
                    ++affinity;
                } else {
                    if (beforeCaret && next.insert !== null) {
                        ++modifiedCaretPosition;
                    }
                    --affinity;
                }
            } else {
                if (iterator.beforeCaret()) {
                    --modifiedCaretPosition;
                }
                beforeCaret = iterator.beforeCaret();
                character = iterator.next();
                --affinity;
            }
        }

        while (autocomplete && beforeCaret) {
            let next: Next | null = state.autocomplete();
            if (next === null) {
                break;
            }
            state = next.state;
            modifiedString += !!next.insert ? next.insert : '';
            extractedValue += !!next.value ? next.value : '';
            if (next.insert !== null) {
                ++modifiedCaretPosition;
            }
        }

        return new Mask.Result(
            new CaretString(
                modifiedString,
                modifiedCaretPosition
            ),
            extractedValue,
            affinity,
            this.noMandatoryCharactersLeftAfterState(state)
        );
    }

    public placeholder = (): String => this.appendPlaceholder(this.initialState, '');

    public acceptableTextLength(): number {
        let state: State | null = this.initialState;
        let length = 0;

        while (!!state && !(state instanceof EOLState)) {
            if (
                state instanceof FixedState
                || state instanceof FreeState
                || state instanceof ValueState
            ) {
                ++length;
            }
            state = state.child;
        }
        return length;
    }

    public totalTextLength(): number {
        let state: State | null = this.initialState;
        let length = 0;

        while (!!state && !(state instanceof EOLState)) {
            if (
                state instanceof FixedState
                || state instanceof FreeState
                || state instanceof ValueState
                || state instanceof OptionalValueState
            ) {
                ++length;
            }
            state = state.child;
        }
        return length;
    }

    public acceptableValueLength(): number {
        let state: State | null = this.initialState;
        let length = 0;

        while (!!state && !(state instanceof EOLState)) {
            if (
                state instanceof FixedState
                || state instanceof ValueState
            ) {
                ++length;
            }
            state = state.child;
        }
        return length;
    }

    public totalValueLength(): number {
        let state: State | null = this.initialState;
        let length = 0;

        while (!!state && !(state instanceof EOLState)) {
            if (
                state instanceof FixedState
                || state instanceof ValueState
                || state instanceof OptionalValueState
            ) {
                ++length;
            }
            state = state.child;
        }
        return length;
    }

    private noMandatoryCharactersLeftAfterState(state: State): boolean {
        if (state instanceof EOLState) {
            return true;
        } else if (state instanceof ValueState) {
            return state.isElliptical;
        } else if (state instanceof FixedState) {
            return false;
        } else {
            return this.noMandatoryCharactersLeftAfterState(state.nextState());
        }
    }

    private appendPlaceholder(state: State | null, placeholder: String): String {
        if (state === null) {
            return placeholder;
        }

        if (state instanceof EOLState) {
            return placeholder;
        }

        if (state instanceof FixedState) {
            return this.appendPlaceholder(
                state.child,
                placeholder.concat(state.ownCharacter.toString())
            );
        }

        if (state instanceof FreeState) {
            return this.appendPlaceholder(
                state.child,
                placeholder.concat(state.ownCharacter.toString())
            );
        }

        if (state instanceof OptionalValueState) {
            if (state.type instanceof OptionalValueState.AlphaNumeric) {
                return this.appendPlaceholder(
                    state.child,
                    placeholder + '-'
                );
            }

            if (state.type instanceof OptionalValueState.Numeric) {
                return this.appendPlaceholder(
                    state.child,
                    placeholder + '0'
                );
            }

            if (state.type instanceof OptionalValueState.Literal) {
                return this.appendPlaceholder(
                    state.child,
                    placeholder + 'a'
                );
            }

            if (state.type instanceof OptionalValueState.Custom) {
                return this.appendPlaceholder(
                    state.child,
                    placeholder.concat(state.type.character.toString())
                );
            }
        }

        if (state instanceof ValueState) {
            if (state.type instanceof ValueState.AlphaNumeric) {
                return this.appendPlaceholder(state.child, placeholder + '-');
            }

            if (state.type instanceof ValueState.Numeric) {
                return this.appendPlaceholder(state.child, placeholder + '0');
            }

            if (state.type instanceof ValueState.Literal) {
                return this.appendPlaceholder(state.child, placeholder + 'a');
            }

            if (state.type instanceof ValueState.Ellipsis) {
                return placeholder;
            }

            if (state.type instanceof ValueState.Custom) {
                return this.appendPlaceholder(state.child, placeholder.concat(state.type.character.toString()));
            }
        }

        return placeholder;
    }

}

export module Mask {
    export class Result {
        constructor(
            readonly formattedText: CaretString,
            readonly extractedValue: String,
            readonly affinity: number,
            readonly complete: boolean
        ) {
        }
    }
}
