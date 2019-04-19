import {CaretString, Mask} from '../src';
import {performance} from "perf_hooks";
import {assert} from 'chai';
import '../src/util/input-event';

describe('y/yy/yyy/(yyyy AC)', () => {
    const format = '[9990] AC';
    const mask: Mask = new Mask(format);
    const placeholder: String = mask.placeholder();

    it('measure new Mask() time', () => {
        const t0 = performance.now();
        const masks: Mask[] = [];

        for (const i of new Array(1000).fill(0)) {
            masks.push(new Mask(format));
        }

        const t1 = performance.now();

        console.log("Initializing new Mask took " + (t1 - t0) + " milliseconds.");
    });

    it('measure getOrCreate time', () => {
        const t0 = performance.now();

        const masks: Mask[] = [];

        for (const i of new Array(1000).fill(0)) {
            masks.push(Mask.getOrCreate(format, []));
        }

        const t1 = performance.now();

        console.log("Calling getOrCreate took " + (t1 - t0) + " milliseconds.");
    });

    it('#new Mask should initialize mask', () => {
        assert.isNotNull(mask);
    });

    it('#Mask.placeholder() should return correct placeholder', () => {
        assert.equal(placeholder, '0000 AC');
    });

    it('#Mask.acceptableTextLength() should return correct count', () => {
        const acceptableTextLength: number = mask.acceptableTextLength();
        assert.equal(acceptableTextLength, 4);
    });

    it('#Mask.totalTextLength() should return correct count', () => {
        const totalTextLength: number = mask.totalTextLength();
        assert.equal(totalTextLength, 7);
    });

    it('#Mask.acceptableValueLength() should return correct count', () => {
        const acceptableValueLength: number = mask.acceptableValueLength();
        assert.equal(acceptableValueLength, 1);
    });

    it('#Mask.totalValueLength() should return correct count', () => {
        const totalValueLength: number = mask.totalValueLength();
        assert.equal(totalValueLength, 4);
    });

    it('apply "1" return "1"', () => {
        const inputString = '1';
        const inputCaret: number = inputString.length;

        const expectedString = '1';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '1';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, true);
    });

    it('apply "12" return "12"', () => {
        const inputString = '12';
        const inputCaret: number = inputString.length;

        const expectedString = '12';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, true);
    });

    it('apply "123" return "123"', () => {
        const inputString = '123';
        const inputCaret: number = inputString.length;

        const expectedString = '123';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '123';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, true);
    });

    it('apply "1234" return "1234"', () => {
        const inputString = '1234';
        const inputCaret: number = inputString.length;

        const expectedString = '1234';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '1234';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, true);
    });

    it('apply "12345" return "1234 AC"', () => {
        const inputString = '12345';
        const inputCaret: number = inputString.length;

        const expectedString = '1234 AC';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '1234';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, true);
    });

    it('apply "1234" with autocomplete return "1234 AC"', () => {
        const inputString = '1234';
        const inputCaret: number = inputString.length;

        const expectedString = '1234 AC';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '1234';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, true);
    });
});
