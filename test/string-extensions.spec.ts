import {assert} from 'chai';
import '../src/util/string';

describe('String extensions test', function () {
    it('String.isLetter should accept non ASCII characters', function () {
        const testStr = ['Düsseldorf','Köln','Москва','北京市','إسرائيل'];

        testStr.forEach((x: string) => {
            for (let char of x) {
                assert.isTrue(char.isLetter())
            }
        })
    });

    it('String.isDigit should accept only numbers', function () {
        const testStr = ['0123456789d_-!#@$%^&*)(_{}[] '];

        testStr.forEach((x: string) => {
            let i = 0;
            for (let char of x) {
                if (i < 10) {
                    assert.isTrue(char.isDigit());
                } else {
                    assert.isFalse(char.isDigit());
                }
                i++;
            }
        })
    });
})
