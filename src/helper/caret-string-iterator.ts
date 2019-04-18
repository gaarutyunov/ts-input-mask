import {CaretString} from '../model';

export class CaretStringIterator {
    constructor(
        private readonly caretString: CaretString,
        private currentIndex: number = 0
    ) {
    }

    public beforeCaret(): boolean {
        return this.currentIndex <= this.caretString.caretPosition
            || (this.currentIndex === 0 && this.caretString.caretPosition === 0);
    }

    public next(): String | null {
        if (this.currentIndex >= this.caretString.string.length) {
            return null;
        }

        const char: String = this.caretString.string.toCharArray()[this.currentIndex];
        ++this.currentIndex;
        return char;
    }

}
