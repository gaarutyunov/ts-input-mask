import {CaretString, Notation} from './model';
import {
    AffinityCalculation,
    AffinityCalculationStrategy
} from './helper/affinity-calculation-strategy';
import {Mask} from './helper/mask';
import {MaskAffinity} from './helper/mask-affinity';
import {InputEvent} from 'input-event';

export class MaskedTextChangedListener {
    protected readonly affineFormats: ReadonlyArray<String> = [];
    protected readonly customNotations: ReadonlyArray<Notation> = [];
    protected readonly affinityCalculationStrategy: AffinityCalculation =
        new AffinityCalculation(AffinityCalculationStrategy.WHOLE_STRING);
    protected readonly autocomplete: boolean = true;
    private readonly primaryMask = Mask.getOrCreate(this.primaryFormat, this.customNotations);
    private afterText: String = '';
    private caretPosition = 0;

    constructor(
        protected readonly primaryFormat: String,
        private field: HTMLInputElement,
        protected readonly listener?: MaskedTextChangedListener.ValueListener,
        affineFormats: ReadonlyArray<String> = [],
        customNotations: ReadonlyArray<Notation> = [],
        affinityCalculationStrategy: AffinityCalculation =
            new AffinityCalculation(AffinityCalculationStrategy.WHOLE_STRING),
        autocomplete: boolean = true
    ) {
        this.affineFormats = affineFormats;
        this.customNotations = customNotations;
        this.affinityCalculationStrategy = affinityCalculationStrategy;
        this.autocomplete = autocomplete;
        this.addEvents(field);
    }

    public placeholder = () => this.primaryMask.placeholder();
    public acceptableTextLength = () => this.primaryMask.acceptableTextLength();
    public totalTextLength = () => this.primaryMask.totalTextLength();
    public totalValueLength = () => this.primaryMask.totalValueLength();

    public setText(text: String): Mask.Result | null {
        let result: Mask.Result = null;
        if (!!this.field.value) {
            result = this._setText(text, this.field);
            this.afterText = result.formattedText.string;
            this.caretPosition = result.formattedText.caretPosition;
            if (!!this.listener) {
                this.listener.onTextChanged(result.complete, result.extractedValue, this.afterText);
            }
        }
        return result;
    }

    private _setText(text: String, field: HTMLInputElement): Mask.Result {
        const result: Mask.Result = this.pickMask(text, text.length, this.autocomplete).apply(
            new CaretString(text, text.length),
            this.autocomplete
        );
        field.value = String(result.formattedText.string);
        field.setSelectionRange(result.formattedText.caretPosition, result.formattedText.caretPosition);
        return result;
    }

    private pickMask(
        text: String,
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
        const maskAndAffinities: Array<MaskAffinity> = [];

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
        text: String,
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
        field.addEventListener('input', (ev: HTMLElementEventMap['input']) => {
            this.onTextChanged(field.value, ev);
        });
        field.addEventListener('focus', (ev: HTMLElementEventMap['focus']) => {
            this.onFocusChange(true);
        });
        field.addEventListener('blur', (ev: HTMLElementEventMap['blur']) => {
            this.onFocusChange(false);
        });
    }

    private onFocusChange(hasFocus: boolean): void {
        if (this.autocomplete && hasFocus) {
            const text: String = !!this.field.value ? this.field.value : '';
            const result: Mask.Result = this.pickMask(text, text.length, this.autocomplete).apply(
                new CaretString(text, text.length),
                this.autocomplete
            );

            this.afterText = result.formattedText.string;
            this.caretPosition = result.formattedText.caretPosition;
            this.field.value = String(this.afterText);
            this.field.setSelectionRange(result.formattedText.caretPosition, result.formattedText.caretPosition);
            if (!!this.listener) {
                this.listener.onTextChanged(result.complete, result.extractedValue, this.afterText);
            }
        }
    }

    private onTextChanged(text: String, event: Event): void {
        const isDeletion = (<InputEvent> event).inputType === 'deleteContentForward' || (<InputEvent> event).inputType === 'deleteContentBackward';
        const caretPosition = isDeletion ? this.field.selectionStart : text.length;
        const result: Mask.Result = this.pickMask(text, caretPosition, this.autocomplete && !isDeletion).apply(
            new CaretString(text, caretPosition),
            this.autocomplete && !isDeletion
        );
        this.afterText = result.formattedText.string;
        this.caretPosition = isDeletion ? this.field.selectionStart : result.formattedText.caretPosition;
        this.field.value = String(this.afterText);
        this.field.setSelectionRange(result.formattedText.caretPosition, result.formattedText.caretPosition);
        if (!!this.listener) {
            this.listener.onTextChanged(result.complete, result.extractedValue, this.afterText);
        }
    }

}

export declare namespace MaskedTextChangedListener {
    class ValueListener {
        onTextChanged(
            maskFilled: boolean,
            extractedValue: String,
            formattedValue: String
        );
    }
}
