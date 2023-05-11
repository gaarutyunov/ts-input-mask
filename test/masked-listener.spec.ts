import {assert} from "chai";
import {MaskedTextChangedListener} from "../src";
import {screen, fireEvent} from '@testing-library/dom';
import {spy} from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

describe('MaskedTextChangedListener', () => {
    const format = '[00]/[00]';
    let listener: MaskedTextChangedListener;
    let valueListener: MaskedTextChangedListener.ValueListener;

    class ValueListener implements MaskedTextChangedListener.ValueListener {
        onTextChanged(maskFilled: boolean, extractedValue: string, formattedValue: string) {
        }
    }

    beforeEach(() => {
        const input = document.createElement('input');
        input.setAttribute('data-testid', 'input');
        document.body.appendChild(input);
        valueListener = new ValueListener();
        listener = MaskedTextChangedListener.installOn(
            format,
            input,
            valueListener,
        );
    });

    afterEach(() => {
        document.body.removeChild(screen.queryByTestId('input')!);
    });

    it('Formats value', () => {
        const input = screen.queryByTestId<HTMLInputElement>('input')!;
        fireEvent.input(input, { target: { value: 'a12b31' } });
        assert.equal(input.value, '12/31');
    });

    it('Do nothing after format by mask and dispose', () => {
        const input = screen.queryByTestId<HTMLInputElement>('input')!;
        fireEvent.input(input, { target: { value: '1231' } });
        listener.dispose();
        fireEvent.input(input, { target: { value: 'abcd' } });
        assert.equal(input.value, 'abcd');
    });

    it('Calls onTextChanged if mask has been filled', () => {
        const textChangedSpy = spy(valueListener, 'onTextChanged');
        const input = screen.queryByTestId<HTMLInputElement>('input')!;
        fireEvent.input(input, { target: { value: '12b31' } });

        textChangedSpy.should.have.been.calledWith(true, '1231', '12/31');
    });

    it('Calls onTextChanged if mask hasn\'t been filled', () => {
        const textChangedSpy = spy(valueListener, 'onTextChanged');
        const input = screen.queryByTestId<HTMLInputElement>('input')!;
        fireEvent.input(input, { target: { value: '12b' } });

        textChangedSpy.should.have.been.calledWith(false, '12', '12/');
    });
});