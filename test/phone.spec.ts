import {assert} from 'chai';
import {bdd, runTest} from 'mocha-classes';
import {CaretString, Mask} from '../src';
import {performance} from 'perf_hooks';

describe('PhoneSpec', () => {
    const format = '+7 ([000]) [000]-[00]-[00]';
    const newMask: Mask = new Mask(format);
    const placeholder: String = newMask.placeholder();

    it('measure new Mask() time', () => {
        const t0 = performance.now();

        const mask: Mask = new Mask(format);

        const t1 = performance.now();

        console.log("Initializing new Mask took " + (t1 - t0) + " milliseconds.");
    });

    it('measure getOrCreate time', () => {
        const t0 = performance.now();

        const mask: Mask = Mask.getOrCreate(format, []);

        const t1 = performance.now();

        console.log("Calling getOrCreate took " + (t1 - t0) + " milliseconds.");
    });

    it('#new Mask should initialize mask', () => {
        assert.isNotNull(newMask);
    });

    it('#Mask.placeholder() should return correct placeholder', () => {
        assert.equal(placeholder, '+7 (000) 000-00-00');
    });

    it('#Mask.acceptableTextLength() should return correct count', () => {
        const acceptableTextLength: number = newMask.acceptableTextLength();
        assert.equal(acceptableTextLength, 18);
    });

    it('#Mask.totalTextLength() should return correct count', () => {
        const totalTextLength: number = newMask.totalTextLength();
        assert.equal(totalTextLength, 18);
    });

    it('#Mask.acceptableValueLength() should return correct count', () => {
        const acceptableValueLength: number = newMask.acceptableValueLength();
        assert.equal(acceptableValueLength, 10);
    });

    it('#Mask.totalValueLength() should return correct count', () => {
        const totalValueLength: number = newMask.totalValueLength();
        assert.equal(totalValueLength, 10);
    });

    it('apply "+" return "+"', () => {
       const inputString = '+';
       const inputCaret: number = inputString.length;

       const expectedString = '+';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7" return "+7"', () => {
       const inputString = '+7';
       const inputCaret: number = inputString.length;

       const expectedString = '+7';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 " return "+7 "', () => {
       const inputString = '+7 ';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 ';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (" return "+7 ("', () => {
       const inputString = '+7 (';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (1" return "+7 (1"', () => {
       const inputString = '+7 (1';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (1';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '1';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (12" return "+7 (12"', () => {
       const inputString = '+7 (12';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (12';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '12';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123" return "+7 (123"', () => {
       const inputString = '+7 (123';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '123';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123)" return "+7 (123)"', () => {
       const inputString = '+7 (123)';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123)';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '123';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123) " return "+7 (123) "', () => {
       const inputString = '+7 (123) ';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) ';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '123';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123) 4" return "+7 (123) 4"', () => {
       const inputString = '+7 (123) 4';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 4';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '1234';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123) 45" return "+7 (123) 45"', () => {
       const inputString = '+7 (123) 45';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 45';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '12345';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123) 456" return "+7 (123) 456"', () => {
       const inputString = '+7 (123) 456';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 456';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '123456';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123) 456-" return "+7 (123) 456-"', () => {
       const inputString = '+7 (123) 456-';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 456-';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '123456';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123) 456-7" return "+7 (123) 456-7"', () => {
       const inputString = '+7 (123) 456-7';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 456-7';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '1234567';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123) 456-78" return "+7 (123) 456-78"', () => {
       const inputString = '+7 (123) 456-78';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 456-78';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '12345678';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123) 456-78-" return "+7 (123) 456-78-"', () => {
       const inputString = '+7 (123) 456-78-';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 456-78-';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '12345678';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123) 456-78-9" return "+7 (123) 456-78-9"', () => {
       const inputString = '+7 (123) 456-78-9';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 456-78-9';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '123456789';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (123) 456-78-90" return "+7 (123) 456-78-90"', () => {
       const inputString = '+7 (123) 456-78-90';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 456-78-90';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '1234567890';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, true);
    });

    it('apply "7" return "+7"', () => {
       const inputString = '7';
       const inputCaret: number = inputString.length;

       const expectedString = '+7';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "9" return "+7 (9"', () => {
       const inputString = '9';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (9';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '9';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "1234567890" return "+7 (123) 456-78-90"', () => {
       const inputString = '1234567890';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 456-78-90';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '1234567890';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, true);
    });

    it('apply "+1234567890" return "+7 (123) 456-78-90"', () => {
       const inputString = '+1234567890';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 456-78-90';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '1234567890';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, true);
    });

    it('apply "+(123)4567890" return "+7 (123) 456-78-90"', () => {
       const inputString = '+(123)4567890';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (123) 456-78-90';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '1234567890';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), false);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, true);
    });

    it('apply "" return "+7 (" with autocomplete=true', () => {
       const inputString = '';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), true);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7" return "+7" with autocomplete=true', () => {
       const inputString = '';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), true);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 " return "+7 (" with autocomplete=true', () => {
       const inputString = '+7 ';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), true);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });

    it('apply "+7 (" return "+7 (" with autocomplete=true', () => {
       const inputString = '+7 (';
       const inputCaret: number = inputString.length;

       const expectedString = '+7 (';
       const expectedCaret: number = expectedString.length;
       const expectedValue = '';

       const result: Mask.Result = newMask.apply(new CaretString(inputString, inputCaret), true);

       assert.equal(expectedString, result.formattedText.string);
       assert.equal(expectedCaret, result.formattedText.caretPosition);
       assert.equal(expectedValue, result.extractedValue);

       assert.equal(result.complete, false);
    });
});