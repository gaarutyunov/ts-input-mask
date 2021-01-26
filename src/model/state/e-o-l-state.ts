import {State} from '../state';
import {Next} from '../next';

export class EOLState extends State {
    public constructor(
        readonly child: State = null
    ) {
        super(child);
    }

    public accept(character: string): Next | null {
        return null;
    }

    public toString(): string {
        return 'EOL';
    }
}
