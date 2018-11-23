import { renderComponent } from 'tests/testUtils';
import { messages } from 'utils';
import Link from 'lib/Link';

describe('messages', () => {
  it('plain text', () => {
    const text = 'Mary had a little lamb.';
    expect(messages.parseText(text)).toEqual([text]);
  });

  it('mentions', () => {
    const tags   = [{ name: '@lamb', id: 1 }];
    const text   = 'Mary had a little @lamb.';
    const parsed = messages.parseText(text, tags);
    const test   = renderComponent(parsed);

    const testInstance = test.root;
    const link = testInstance.findByType(Link);
    expect(link.props.name).toEqual('profile');
    expect(link.props.params).toEqual({ id: 1 });
    expect(link.props.children).toEqual('@lamb');
  });
});
