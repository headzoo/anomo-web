import { numbers } from 'utils';

describe('numbers', () => {
  it('addCommas', () => {
    expect(numbers.addCommas(12345)).toEqual('12,345');
  });

  it('money', () => {
    expect(numbers.money(123.45)).toEqual('$123.45');
  });

  it('percent', () => {
    expect(numbers.percent(12345)).toEqual('12,345%');
  });

  it('isInt', () => {
    expect(numbers.isInt(12345)).toEqual(true);
    expect(numbers.isInt('123')).toEqual(true);
    expect(numbers.isInt('123', true)).toEqual(false);
    expect(numbers.isInt('test')).toEqual(false);
  });

  it('isFloat', () => {
    expect(numbers.isFloat(123.45)).toEqual(true);
    expect(numbers.isFloat('123.45')).toEqual(true);
    expect(numbers.isFloat('123.45', true)).toEqual(false);
    expect(numbers.isFloat(12345)).toEqual(false);
    expect(numbers.isFloat('test')).toEqual(false);
  });

  it('parseAny', () => {
    expect(numbers.parseAny(123)).toEqual(123);
    expect(numbers.parseAny('123')).toEqual(123);
    expect(numbers.parseAny(123.45)).toEqual(123.45);
    expect(numbers.parseAny('123.45')).toEqual(123.45);
    expect(numbers.parseAny('test')).toEqual(0);
  });
});
