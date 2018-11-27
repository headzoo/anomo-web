import { strings } from 'utils';

describe('strings', () => {
  it('endsWith', () => {
    expect(strings.ucWords('hello world')).toEqual('Hello World');
  });
});
