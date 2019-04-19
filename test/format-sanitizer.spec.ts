import {assert} from 'chai';
import {FormatSanitizer} from '../src/helper/format-sanitizer';
import '../src/util/string';

describe('FormatSanitizer', () => {
    it('should throw error with wrong string', () => {
        assert.throws(() => FormatSanitizer.sanitize('+7 ([0[0]0]) [000]-[00]-[00]'), 'Wrong format');
    });

    it('should saintize string "[0909]" to "[0099]"', function() {
        const expectedString = '[0099]';
        const actualString = FormatSanitizer.sanitize('[0909]');
        assert.equal(expectedString, actualString);
    });

    it('should sanitize string "[09Aa_-]" to "[09][Aa][_-]"', () => {
        const expectedString = '[09][Aa][_-]';
        const actualString = FormatSanitizer.sanitize('[09Aa_-]');
        assert.equal(expectedString, actualString);
    });

    it('should throw error with two opened curly braces', () => {
        assert.throws(() => FormatSanitizer.sanitize('{{.'), 'Wrong format');
    });

    it('should include bracket if escaped', () => {
        const expectedString = '\\[0909]';
        const actualString = FormatSanitizer.sanitize('\\[0909]');
        assert.equal(expectedString, actualString);
    });
});
