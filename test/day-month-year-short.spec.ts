import {assert} from 'chai';
import {bdd, runTest} from 'mocha-classes';
import {CaretString, Mask} from '../src';
import {performance} from 'perf_hooks';
import '../src/util/input-event';

describe('d.m.yyyy / dd.mm.yyyy', () => {
    const format = '[90]{.}[90]{.}[0000]';
    const mask = new Mask(format);
    const placeholder: string = mask.placeholder();

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

        console.log('Initializing new Mask took ' + (t1 - t0) + ' milliseconds.');
    });

    it('measure getOrCreate time', () => {
        const t0 = performance.now();

        const masks: Mask[] = [];

        for (const i of new Array(1000).fill(0)) {
            masks.push(Mask.getOrCreate(format, []));
        }

        const t1 = performance.now();

        console.log('Calling getOrCreate took ' + (t1 - t0) + ' milliseconds.');
    });

    it('#Mask.placeholder() should return correct placeholder', () => {
        assert.equal(placeholder, '00.00.0000');
    });

    it('#Mask.acceptableTextLength() should return correct count', () => {
        const acceptableTextLength: number = mask.acceptableTextLength();
        assert.equal(acceptableTextLength, 8);
    });

    it('#Mask.totalTextLength() should return correct count', () => {
        const totalTextLength: number = mask.totalTextLength();
        assert.equal(totalTextLength, 10);
    });

    it('#Mask.acceptableValueLength() should return correct count', () => {
        const acceptableValueLength: number = mask.acceptableValueLength();
        assert.equal(acceptableValueLength, 8);
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

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(1, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "11" return "11"', () => {
        const inputString = '11';
        const inputCaret: number = inputString.length;

        const expectedString = '11';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(2, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "111" return "11.1"', () => {
        const inputString = '111';
        const inputCaret: number = inputString.length;

        const expectedString = '11.1';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.1';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(2, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "1111" return "1111"', () => {
        const inputString = '1111';
        const inputCaret: number = inputString.length;

        const expectedString = '11.11';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.11';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(3, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "123456" return "123456"', () => {
        const inputString = '123456';
        const inputCaret: number = inputString.length;

        const expectedString = '12.34.56';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.34.56';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(4, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "12.3" return "12.3"', () => {
        const inputString = '12.3';
        const inputCaret: number = inputString.length;

        const expectedString = '12.3';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.3';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(4, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "12.34" return "12.34"', () => {
        const inputString = '12.34';
        const inputCaret: number = inputString.length;

        const expectedString = '12.34';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.34';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(5, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "12.34.56" return "12.34.56"', () => {
        const inputString = '12.34.56';
        const inputCaret: number = inputString.length;

        const expectedString = '12.34.56';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.34.56';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(8, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "1234567" return "12.34.567"', () => {
        const inputString = '1234567';
        const inputCaret: number = inputString.length;

        const expectedString = '12.34.567';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.34.567';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(5, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "12345678" return "12.34.5678"', () => {
        const inputString = '12345678';
        const inputCaret: number = inputString.length;

        const expectedString = '12.34.5678';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '12.34.5678';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(6, result.affinity);
        assert.equal(result.complete, true);
    });

    it('apply "1111" and startIndex=2 return "11.11" and caret=3', () => {
        const inputString = '1111';
        const inputCaret: number = 2;

        const expectedString = '11.11';
        const expectedCaret: number = 3;
        const expectedValue = '11.11';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(3, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "abc1111" return "11.11"', () => {
        const inputString = 'abc1111';
        const inputCaret: number = inputString.length;

        const expectedString = '11.11';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.11';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(0, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "abs1sd111" return "1.11.1"', () => {
        const inputString = 'abs1sd111';
        const inputCaret: number = inputString.length;

        const expectedString = '1.11.1';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '1.11.1';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(result.affinity, -4);
        assert.equal(result.complete, false);
    });

    it('apply "abd1sd1sd11" return "1.1.11"', () => {
        const inputString = 'abd1sd1sd11';
        const inputCaret: number = inputString.length;

        const expectedString = '1.1.11';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '1.1.11';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(-7, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "a" return ""', () => {
        const inputString = 'a';
        const inputCaret: number = inputString.length;

        const expectedString = '';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(-1, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "" return ""', () => {
        const inputString = '';
        const inputCaret: number = inputString.length;

        const expectedString = '';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), false);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(0, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "1" with autocomplete return "1"', () => {
        const inputString = '1';
        const inputCaret: number = inputString.length;

        const expectedString = '1';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '1';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(1, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "11" with autocomplete return "11."', () => {
        const inputString = '11';
        const inputCaret: number = inputString.length;

        const expectedString = '11.';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(2, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "112" with autocomplete return "11.2"', () => {
        const inputString = '112';
        const inputCaret: number = inputString.length;

        const expectedString = '11.2';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.2';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(2, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "1122" with autocomplete return "11.22."', () => {
        const inputString = '1122';
        const inputCaret: number = inputString.length;

        const expectedString = '11.22.';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.22.';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(3, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "11223" with autocomplete return "11.22.3"', () => {
        const inputString = '11223';
        const inputCaret: number = inputString.length;

        const expectedString = '11.22.3';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.22.3';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(3, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "112233" with autocomplete return "11.22.33"', () => {
        const inputString = '112233';
        const inputCaret: number = inputString.length;

        const expectedString = '11.22.33';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.22.33';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(4, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "1122333" with autocomplete return "11.22.333"', () => {
        const inputString = '1122333';
        const inputCaret: number = inputString.length;

        const expectedString = '11.22.333';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.22.333';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(5, result.affinity);
        assert.equal(result.complete, false);
    });

    it('apply "11223333" with autocomplete return "11.22.3333"', () => {
        const inputString = '11223333';
        const inputCaret: number = inputString.length;

        const expectedString = '11.22.3333';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.22.3333';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(6, result.affinity);
        assert.equal(result.complete, true);
    });

    it('apply "112233334" with autocomplete return "11.22.3333"', () => {
        const inputString = '112233334';
        const inputCaret: number = inputString.length;

        const expectedString = '11.22.3333';
        const expectedCaret: number = expectedString.length;
        const expectedValue = '11.22.3333';

        const result: Mask.Result = mask.apply(new CaretString(inputString, inputCaret), true);

        assert.equal(expectedString, result.formattedText.str);
        assert.equal(expectedCaret, result.formattedText.caretPosition);
        assert.equal(expectedValue, result.extractedValue);

        assert.equal(5, result.affinity);
        assert.equal(result.complete, true);
    });
});
