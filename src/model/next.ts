import {State} from "./state";

export class Next {
    public constructor(
        readonly state: State,
        readonly insert: String | null,
        readonly pass: boolean,
        readonly value: String | null
    ) {
    }
}
