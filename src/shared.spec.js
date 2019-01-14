import nock from 'nock';

import { bootstrap, debounce, packParams } from './shared';

jest.useFakeTimers();

describe('Shared', () => {
    describe('bootstrap', () => {
        it('handles network errors', async () => {
            nock(process.env.API_URL)
                .post(process.env.BOOTSTRAP_ENDPOINT, 'key=1234')
                .replyWithError('oops!');
            await bootstrap(1234);
            expect(document.querySelector('span')).toMatchSnapshot();
        });

        it('returns data on success', async () => {
            nock(process.env.API_URL)
                .post(process.env.BOOTSTRAP_ENDPOINT, 'key=1234')
                .reply(200, { token: 5678 });
            const resp = await bootstrap(1234);
            expect(resp.token).toEqual(5678);
        });
    });

    it('debounce', () => {
        const fn = jest.fn();
        const debounced = debounce(fn, 500);
        debounced();
        debounced();
        debounced();
        expect(fn).not.toBeCalled();
        jest.advanceTimersByTime(499);
        expect(fn).not.toBeCalled();
        jest.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('packParams', () => {
        expect(packParams({
            reserved: ';,/?:@&=+$',
            unescaped: '-_.!~*\'()',
            alphanum: 'ABC abc #123',
            ignored: undefined,
            stripped: null,
            missing: '',
            disregarded: 0,
        })).toMatchSnapshot();
    });
});
