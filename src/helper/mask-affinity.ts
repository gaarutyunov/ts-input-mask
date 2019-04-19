import {Mask} from './mask';

export class MaskAffinity {
    constructor(
        readonly mask: Mask,
        readonly affinity: number
    ) {
    }
}
