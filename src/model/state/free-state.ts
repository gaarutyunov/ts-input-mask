import {State} from '../state';
import {Next} from '../next';
import {isNull} from '../../util/isNull';

export class FreeState extends State {
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
                null
            );
        } else {
            return new Next(
                this.nextState(),
                this.ownCharacter,
                false,
                null
            );
        }
    }

    public autocomplete(): Next | null {
        return new Next(
            this.nextState(),
            this.ownCharacter,
            false,
            null
        );
    }

    public toString(): string {
        return `${this.ownCharacter} -> ` + (!isNull<State>(this.child) ? this.child.toString() : 'null');
    }
}
