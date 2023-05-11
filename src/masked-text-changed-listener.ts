import {CaretString, Notation} from './model';
import {
    AffinityCalculation,
    AffinityCalculationStrategy
} from './helper/affinity-calculation-strategy';
import {Mask} from './helper/mask';
import {MaskAffinity} from './helper/mask-affinity';
import {InputEvent} from 'input-event';

export class MaskedTextChangedListener {
    private readonly primaryMask: Mask;
    private afterText: string = '';
    private caretPosition = 0;

    constructor(
        protected readonly primaryFormat: string,
        private field: HTMLInputElement,
        protected readonly listener?: MaskedTextChangedListener.ValueListener,
        protected readonly affineFormats: ReadonlyArray<string> = [],
        protected readonly customNotations: ReadonlyArray<Notation> = [],
        protected readonly affinityCalculationStrategy: AffinityCalculation =
            new AffinityCalculation(AffinityCalculationStrategy.WHOLE_STRING),
        protected readonly autocomplete: boolean = true
    ) {
        this.primaryMask = Mask.getOrCreate(this.primaryFormat, this.customNotations)
        this.addEvents(field);
    }

    static installOn(
        primaryFormat: string,
        field: HTMLInputElement,
        listener?: MaskedTextChangedListener.ValueListener,
        affineFormats: ReadonlyArray<string> = [],
        customNotations: ReadonlyArray<Notation> = [],
        affinityCalculationStrategy: AffinityCalculation =
            new AffinityCalculation(AffinityCalculationStrategy.WHOLE_STRING),
        autocomplete: boolean = true
    ): MaskedTextChangedListener {
        return new MaskedTextChangedListener(
            primaryFormat,
            field,
            listener,
            affineFormats,
            customNotations,
            affinityCalculationStrategy,
            autocomplete
        );
    }

    public placeholder = () => this.primaryMask.placeholder();

    public acceptableTextLength = () => this.primaryMask.acceptableTextLength();

    public totalTextLength = () => this.primaryMask.totalTextLength();

    public totalValueLength = () => this.primaryMask.totalValueLength();

    public setText(text: string): Mask.Result | null {
        let result: Mask.Result = null;
        if (!this.field.value || this.field.value === '') {
            result = this._setText(text, this.field);
            this.afterText = result.formattedText.str;
            this.caretPosition = result.formattedText.caretPosition;
            if (!!this.listener) {
                this.listener.onTextChanged(result.complete, result.extractedValue, this.afterText);
            }
        }
        return result;
    }

    public dispose = (): void => {
        this.field.removeEventListener('input', this.handleInputChange);
        this.field.removeEventListener('focus', this.handleFocus);
        this.field.removeEventListener('blur', this.handleBlur);
    };

    private _setText(text: string, field: HTMLInputElement): Mask.Result {
        const result: Mask.Result = this.pickMask(text, text.length, this.autocomplete).apply(
            new CaretString(text, text.length),
            this.autocomplete
        );
        field.value = String(result.formattedText.str);
        field.setSelectionRange(
            result.formattedText.caretPosition,
            result.formattedText.caretPosition
        );
        return result;
    }

    private pickMask(
        text: string,
        caretPosition: number,
        autocomplete: boolean
    ): Mask {
        text = String(text);
        if (this.affineFormats.length === 0) {
            return this.primaryMask;
        }

        const primaryAffinity: number = this.calculateAffinity(
            this.primaryMask,
            text,
            caretPosition,
            autocomplete
        );
        const maskAndAffinities: MaskAffinity[] = [];

        for (const format of this.affineFormats) {
            const mask: Mask = new Mask(format, this.customNotations);
            const affinity: number = this.calculateAffinity(
                mask,
                text,
                caretPosition,
                autocomplete
            );
            maskAndAffinities.push(new MaskAffinity(mask, affinity));
        }

        maskAndAffinities.sort((a: MaskAffinity, b: MaskAffinity) => b.affinity - a.affinity);

        let insertIndex = -1;

        maskAndAffinities.some((maskAffinity: MaskAffinity, index: number) => {
            if (primaryAffinity >= maskAffinity.affinity) {
                insertIndex = index;
            }
            return primaryAffinity >= maskAffinity.affinity;
        });

        if (insertIndex >= 0) {
            maskAndAffinities[insertIndex] = new MaskAffinity(this.primaryMask, primaryAffinity);
        } else {
            maskAndAffinities.push(new MaskAffinity(this.primaryMask, primaryAffinity));
        }

        return maskAndAffinities[0].mask;
    }

    private calculateAffinity(
        mask: Mask,
        text: string,
        caretPosition: number,
        autocomplete: boolean
    ): number {
        return this.affinityCalculationStrategy.calculateAffinityOfMask(
            mask,
            new CaretString(
                text,
                caretPosition
            ),
            autocomplete
        );
    }

    private addEvents(field: HTMLInputElement): void {
        field.addEventListener('input', this.handleInputChange);
        field.addEventListener('focus', this.handleFocus);
        field.addEventListener('blur', this.handleBlur);
    }

    private handleInputChange = (ev: HTMLElementEventMap['input']): void => {
        this.onTextChanged((ev.target as HTMLInputElement).value, ev);
    };

    private handleFocus = () => this.onFocusChange(true);

    private handleBlur = () => this.onFocusChange(false);

    private onFocusChange(hasFocus: boolean): void {
        if (this.autocomplete && hasFocus) {
            const text: string = !!this.field.value ? this.field.value : '';
            const result: Mask.Result = this.pickMask(text, text.length, this.autocomplete).apply(
                new CaretString(text, text.length),
                this.autocomplete
            );

            this.afterText = result.formattedText.str;
            this.caretPosition = result.formattedText.caretPosition;
            this.field.value = String(this.afterText);
            this.field.setSelectionRange(
                result.formattedText.caretPosition,
                result.formattedText.caretPosition
            );
            if (!!this.listener) {
                this.listener.onTextChanged(result.complete, result.extractedValue, this.afterText);
            }
        }
    }

    private onTextChanged(text: string, event: Event): void {
        const isDeletion: boolean = (event as InputEvent).inputType === 'deleteContentForward'
                                    || (event as InputEvent).inputType === 'deleteContentBackward';
        const isInside: boolean = this.field.selectionStart < text.length;
        const caretPosition = (isDeletion || isInside) ? this.field.selectionStart : text.length;
        const result: Mask.Result = this.pickMask(
            text,
            caretPosition,
            this.autocomplete && !isDeletion
        ).apply(
            new CaretString(text, caretPosition),
            this.autocomplete && !isDeletion
        );
        this.afterText = result.formattedText.str;
        this.caretPosition = (isDeletion || isInside)
                                ? this.field.selectionStart
                                    : result.formattedText.caretPosition;
        this.field.value = String(this.afterText);
        this.field.setSelectionRange(this.caretPosition, this.caretPosition);
        if (!!this.listener) {
            this.listener.onTextChanged(result.complete, result.extractedValue, this.afterText);
        }
    }

}

export declare namespace MaskedTextChangedListener {
    class ValueListener {
        onTextChanged(
            maskFilled: boolean,
            extractedValue: string,
            formattedValue: string
        );
    }
}
