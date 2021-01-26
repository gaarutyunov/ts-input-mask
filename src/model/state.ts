import {Next} from './next';
import {isNull} from '../util/isNull';

export abstract class State {
    protected constructor(
        readonly child: State | null
    ) {
    }

    public abstract accept(character: string): Next | null;

    public autocomplete(): Next | null {
        return null;
    }

    public nextState(): State | never {
        if (!isNull<State>(this.child)) {
            return this.child;
        } else {
            throw new Error('Value cannot be null');
        }
    }

    public toString(): string {
        return 'BASE -> ' + !isNull<State>(this.child) ? this.child.toString() : 'null';
    }
}
