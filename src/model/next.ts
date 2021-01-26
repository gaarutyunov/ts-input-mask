import {State} from './state';

export class Next {
    public constructor(
        readonly state: State,
        readonly insert: string | null,
        readonly pass: boolean,
        readonly value: string | null
    ) {
    }
}
