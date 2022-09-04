import { inn } from '../src/inn';

describe('inn', () => {

    test('empty string', () => {
        expect(inn({ value: '' })).toBe(true)
    });

    test('null', () => {
        expect(inn({ value: null })).toBe(true)
    });

    test('IE: false, correct sum', () => {
        expect(inn({ value: '5610083568', isIE: false })).toBe(true)
    });

    test('IE: false, incorrect sum', () => {
        expect(inn({ value: '1111111111', isIE: false })).toBe(false)
    });

    test('IE: false, incorrect length', () => {
        expect(inn({ value: '8903005', isIE: false })).toBe(false)
    });

    test('IE: true, correct', () => {
        expect(inn({ value: '890300085195', isIE: true })).toBe(true)
    });

    test('IE: true, incorrect sum', () => {
        expect(inn({ value: '111111111111', isIE: true })).toBe(false)
    });

    test('IE: true, incorrect 890300085', () => {
        expect(inn({ value: '890300085', isIE: true })).toBe(false)
    });

    test('IE: not specified, correct', () => {
        expect(inn({ value: '4494267866' })).toBe(true);
    });

    test('IE: not specified, incorrect length', () => {
        expect(inn({ value: '890300085'})).toBe(false)
    });

    test('IE: not specified, zeros', () => {
        expect(inn({ value: '0000000000'})).toBe(false)
    });

    test('IE: not specified, starts with zeros', () => {
        expect(inn({ value: '000000000402'})).toBe(false)
    });
})
