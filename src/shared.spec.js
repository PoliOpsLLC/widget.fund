import nock from 'nock';

import { bootstrap, packParams } from './shared';

describe('Shared', () => {
    describe('bootstrap', () => {
        it('handles network errors', async () => {
            nock(process.env.API_URL)
                .post(process.env.BOOTSTRAP_ENDPOINT, 'key=1234')
                .replyWithError('something bad happened');
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

    it('packParams', () => {
        expect(packParams({
            reserved: ';,/?:@&=+$',
            unescaped: '-_.!~*\'()',
            alphanum: 'ABC abc #123',
        })).toMatchSnapshot();
    });
});
