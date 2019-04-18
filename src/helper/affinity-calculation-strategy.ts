import {Mask} from './mask';
import {CaretString} from '../model';
import '../util/string';

export enum AffinityCalculationStrategy {
    WHOLE_STRING,
    PREFIX
}

export class AffinityCalculation {

    constructor(readonly strategy: AffinityCalculationStrategy) {}

    public calculateAffinityOfMask(
        mask: Mask,
        text: CaretString,
        autocomplete: boolean
    ): number {
        switch (this.strategy) {
            case AffinityCalculationStrategy.WHOLE_STRING: {
                return mask.apply(
                    new CaretString(text.string, text.caretPosition),
                    autocomplete
                ).affinity
            }
            case AffinityCalculationStrategy.PREFIX: {
                return mask.apply(
                    new CaretString(text.string, text.caretPosition),
                    autocomplete
                ).formattedText.string.prefixIntersection(text.string).length
            }
        }
    }
}
