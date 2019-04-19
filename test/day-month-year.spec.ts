import {assert} from 'chai';
import {bdd, runTest} from 'mocha-classes';
import {CaretString, Mask} from '../src';
import {performance} from 'perf_hooks';
import '../src/util/input-event';

describe('dd/mm/yyyy mask', () => {
    const format = '[00]{.}[00]{.}[0000]';
    const mask = new Mask(format);
    const placeholder: String = mask.placeholder();

    it('should initialize mask', () => {
        assert.isNotNull(mask);
    });

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

    it('#Mask.placeholder() should return correct placeholder', () => {
        assert.equal(placeholder, '00.00.0000');
    });

    it('#Mask.acceptableTextLength() should return correct count', () => {
        const acceptableTextLength: number = mask.acceptableTextLength();
        assert.equal(acceptableTextLength, 10);
    });

    it('#Mask.totalTextLength() should return correct count', () => {
        const totalTextLength: number = mask.totalTextLength();
        assert.equal(totalTextLength, 10);
    });

    it('#Mask.acceptableValueLength() should return correct count', () => {
        const acceptableValueLength: number = mask.acceptableValueLength();
        assert.equal(acceptableValueLength, 10);
    });

    it('#Mask.totalValueLength() should return correct count', () => {
        const totalValueLength: number = mask.totalValueLength();
        assert.equal(totalValueLength, 10);
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

        assert.equal(result.complete, false);
    });

    it('apply "11" return "11"', () => {
        const inputString = '11';
        const inputCaret: number = inputString.length;

        const expectedString = '11';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "11." return "11."', () => {
        const inputString = '11.';
        const inputCaret: number = inputString.length;

        const expectedString = '11.';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "1111" return "11.11"', () => {
        const inputString = '1111';
        const inputCaret: number = inputString.length;

        const expectedString = '11.11';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.11';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "123456" return "12.34.56"', () => {
        const inputString = '123456';
        const inputCaret: number = inputString.length;

        const expectedString = '12.34.56';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.34.56';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "12345678" return "12.34.5678"', () => {
        const inputString = '12345678';
        const inputCaret: number = inputString.length;

        const expectedString = '12.34.5678';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.34.5678';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, true);
    });

    it('apply "1111" and startIndex return "11.11" and correct index', () => {
        const inputString = '1111';
        const inputCaret: number = 0;

        const expectedString = '11.11';
        const expectedCaret: number = 0;
        const expectedValue = '11.11';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "1111" and startIndex=2 return "11.11" and caretPosition=3', () => {
        const inputString = '1111';
        const inputCaret: number = 2;

        const expectedString = '11.11';
        const expectedCaret: number = 3;
        const expectedValue = '11.11';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "abc1111" return "11.11"', () => {
        const inputString = 'abc1111';
        const inputCaret: number = inputString.length;

        const expectedString = '11.11';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.11';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "" with autocomplete return ""', () => {
        const inputString = '';
        const inputCaret: number = inputString.length;

        const expectedString = '';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "1" with autocomplete return "1"', () => {
        const inputString = '1';
        const inputCaret: number = inputString.length;

        const expectedString = '1';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '1';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "11" with autocomplete return "11."', () => {
        const inputString = '11';
        const inputCaret: number = inputString.length;

        const expectedString = '11.';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "1234" with autocomplete return "12.34."', () => {
        const inputString = '1234';
        const inputCaret: number = inputString.length;

        const expectedString = '12.34.';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.34.';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, false);
    });

    it('apply "12345678" with autocomplete return "12.34.5678"', () => {
        const inputString = '12345678';
        const inputCaret: number = inputString.length;

        const expectedString = '12.34.5678';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.34.5678';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, true);
    });

    it('apply "1234567823232" with autocomplete return "12.34.5678"', () => {
        const inputString = '1234567823232';
        const inputCaret: number = inputString.length;

        const expectedString = '12.34.5678';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.34.5678';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.string);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.complete, true);
    });
});
