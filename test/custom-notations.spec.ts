import {CaretString, Mask, Notation} from '../src';
import {assert} from 'chai';
import '../src/util/input-event';

describe('Custom Notations', function () {
    const hourCustomNotations = [
        new Notation(
            'H',
            ['0', '1', '2'],
            true
        ),
        new Notation(
            'h',
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            true
        ),
        new Notation(
            'M',
            ['0', '1', '2', '3', '4', '5', '7', '8', '9'],
            false
        ),
        new Notation(
            'm',
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            false
        )
    ];
    const hourMask = Mask.getOrCreate('[Hh]{:}[Mm]', hourCustomNotations);

    it('should return "1" with input "1"', function () {
        const inputStr = '1';
        const result = hourMask.apply(new CaretString(inputStr, inputStr.length), true);

        assert.equal(result.extractedValue, '1');
    });

    it('should return "12:" with input "12"', function () {
        const inputStr = '12';
        const result = hourMask.apply(new CaretString(inputStr, inputStr.length), true);

        assert.equal(result.extractedValue, '12:');
    });

    it('should return "12:5" with input "125"', function () {
        const inputStr = '125';
        const result = hourMask.apply(new CaretString(inputStr, inputStr.length), true);

        assert.equal(result.extractedValue, '12:5');
    });

    it('should return "12:59" with input "1259"', function () {
        const inputStr = '1259';
        const result = hourMask.apply(new CaretString(inputStr, inputStr.length), true);

        assert.equal(result.extractedValue, '12:59');
    });

    it('should return "0" with input "0"', function () {
        const inputStr = '0';
        const result = hourMask.apply(new CaretString(inputStr, inputStr.length), true);

        assert.equal(result.extractedValue, '0');
    });

    it('should return "0:" with input "0:"', function () {
        const inputStr = '0:';
        const result = hourMask.apply(new CaretString(inputStr, inputStr.length), true);

        assert.equal(result.extractedValue, '0:');
    });

    it('should return "0:" with input "0:6"', function () {
        const inputStr = '0:6';
        const result = hourMask.apply(new CaretString(inputStr, inputStr.length), true);

        assert.equal(result.extractedValue, '0:');
    });

    it('should return "0:5" with input "0:5"', function () {
        const inputStr = '0:5';
        const result = hourMask.apply(new CaretString(inputStr, inputStr.length), true);

        assert.equal(result.extractedValue, '0:5');
    });

    it('should return "0:59" with input "0:59"', function () {
        const inputStr = '0:59';
        const result = hourMask.apply(new CaretString(inputStr, inputStr.length), true);

        assert.equal(result.extractedValue, '0:59');
    });
})
