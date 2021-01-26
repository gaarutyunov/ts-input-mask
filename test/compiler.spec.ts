import {Compiler} from '../src/helper/compiler';
import {EOLState, FixedState, FreeState, OptionalValueState, State, ValueState} from '../src/model';
import {assert} from 'chai';
import {Mask} from '../src';
import '../src/util/input-event';

describe('Compiler', () => {
    it('should return correct state', () => {
        const initialState: State = new Compiler([]).compile('[09]{.}[09]{.}19[00]');
        let state: State = initialState;
        const stateList: State[] = [];

        while (!!state && !(state instanceof EOLState)) {
            stateList.push(state);
            state = state.child;
        }

        const correctnessList: boolean[] = stateList.map((value: State, index: number) => {
            switch (index) {
                case 0:
                    return value instanceof ValueState;
                case 1:
                    return value instanceof OptionalValueState;
                case 2:
                    return value instanceof FixedState;
                case 3:
                    return value instanceof ValueState;
                case 4:
                    return value instanceof OptionalValueState;
                case 5:
                    return value instanceof FixedState;
                case 6:
                    return value instanceof FreeState;
                case 7:
                    return value instanceof FreeState;
                case 8:
                    return value instanceof ValueState;
                case 9:
                    return value instanceof ValueState;
            }
        });

        const isCorrect: boolean = correctnessList.reduce<boolean>((a: boolean, b: boolean) => a && b, true);

        assert.isTrue(isCorrect);
    });

    it('should throw error', () => {
        assert.throws(() => new Compiler([]).compile('[00[9]9]'), 'Wrong format');
    });

    it('should compile with escape', () => {
        const initialState: State = new Compiler([]).compile('\\[09]{.}');
        let state: State = initialState;
        const stateList: State[] = [];

        while (!!state && !(state instanceof EOLState)) {
            stateList.push(state);
            state = state.child;
        }
        console.log(new Mask('\\[09]{.}').placeholder());
    });
});
