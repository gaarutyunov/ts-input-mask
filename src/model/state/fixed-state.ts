import {State} from '../state';
import {Next} from '../next';
import {isNull} from '../../util/isNull';

export class FixedState extends State {
    constructor(
        readonly child: State,
        readonly ownCharacter: string
    ) {
        super(child);
    }

    public accept(character: string): Next | null {
        if (this.ownCharacter === character) {
            return new Next(
                this.nextState(),
                character,
                true,
                character
            );
        } else {
            return new Next(
                this.nextState(),
                this.ownCharacter,
                false,
                this.ownCharacter
            );
        }
    }

    public autocomplete(): Next | null {
        return new Next(
            this.nextState(),
            this.ownCharacter,
            false,
            this.ownCharacter
        );
    }

    public toString(): string {
        return `{${this.ownCharacter}} -> ` + (!isNull<State>(this.child) ? this.child.toString() : 'null');
    }
}
