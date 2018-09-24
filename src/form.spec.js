import { h, render } from 'preact';
import nock from 'nock';

import Form from './form';

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

const packParams = params => {
    return Object.keys(params).map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }).join('&');
};

const simulateOn = (target, name, props = {}) => {
    const node = document.querySelector(target);
    const event = new Event(name, { bubbles: true });
    Object.assign(event, props);
    node.dispatchEvent(event);
};

describe('Form', () => {
    let result, scratch;

    const mount = async (overrides = {}) => {
        const props = {
            packParams,
            location_url: 'http://localhost/location',
            employer_url: 'http://localhost/employer',
            local_url: 'http://localhost/local',
            submit_url: 'http://localhost/submit',
            apiKey: 'API_KEY',
            token: 'TOKEN',
            ...overrides,
        };
        render(<Form ref={c => result = c} {...props} />, scratch);

        // one flush for each GET
        await flushPromises();
        await flushPromises();
        await flushPromises();
    };

    beforeAll(() => {
        global.Date.now = jest.fn(() => 1537832579326);
        scratch = document.createElement('div');
        document.body.appendChild(scratch);
    });

    beforeEach(() => {
        scratch.innerHTML = '';
        nock('http://localhost').get('/location').query(true)
            .reply(200, {
                results: [
                    { value: 'IA', display_name: 'Iowa' },
                    { value: 'LA', display_name: 'Louisiana' },
                ],
            });
        nock('http://localhost').get('/employer').query(true)
            .reply(200, {
                results: [
                    { address: { state: 'IA' }, locals: [1], name: 'Sample 3', pk: 3 },
                    { address: { state: 'LA' }, locals: [], name: 'Sample 4', pk: 4 },
                    { address: { state: 'LA' }, locals: [2], name: 'Sample 5', pk: 5 },
                ],
            });
        nock('http://localhost').get('/local').query(true)
            .reply(200, {
                results: [
                    { address: { state: 'LA' }, employers: [5], name: 'Sample 2', pk: 2 },
                    { address: { state: 'IA' }, employers: [], name: 'Sample 6', pk: 6 },
                    { address: { state: 'IA' }, employers: [3], name: 'Sample 1', pk: 1 },
                    { address: null, employers: [], name: 'Sample 7', pk: 7 },
                ],
            });
    });

    afterEach(() => {
        nock.cleanAll();
    });

    afterAll(() => {
        scratch.parentNode.removeChild(scratch);
        scratch = null;
    });

    it('loads all options on render', async done => {
        await mount();
        // wait for setState and its callback to finish at end of promise
        process.nextTick(() => {
            expect(result.base).toMatchSnapshot();
            expect(result.state).toMatchSnapshot();
            done();
        });
    });

    it('constrains employers based on state/local', async done => {
        await mount();
        // wait for setState and its callback to finish at end of promise
        process.nextTick(() => {
            simulateOn('input[name^="employer"]', 'focus');
            expect(document.querySelector('input[name^="employer"] ~ ul')).toMatchSnapshot();

            simulateOn('input[name^="location"]', 'focus');
            simulateOn('input[name^="location"] ~ ul li:last-child', 'mousedown', { button: 0 });
            simulateOn('input[name^="employer"]', 'focus');
            expect(document.querySelector('input[name^="employer"] ~ ul')).toMatchSnapshot();

            simulateOn('input[name^="local"]', 'focus');
            simulateOn('input[name^="local"] ~ ul li:first-child', 'mousedown', { button: 0 });
            simulateOn('input[name^="employer"]', 'focus');
            expect(document.querySelector('input[name^="employer"] ~ ul')).toMatchSnapshot();
            done();
        });
    });

    it('constrains locals based on state/employer', async done => {
        await mount();
        // wait for setState and its callback to finish at end of promise
        process.nextTick(() => {
            simulateOn('input[name^="local"]', 'focus');
            expect(document.querySelector('input[name^="local"] ~ ul')).toMatchSnapshot();

            simulateOn('input[name^="location"]', 'focus');
            simulateOn('input[name^="location"] ~ ul li:first-child', 'mousedown', { button: 0 });
            simulateOn('input[name^="local"]', 'focus');
            expect(document.querySelector('input[name^="local"] ~ ul')).toMatchSnapshot();

            simulateOn('input[name^="employer"]', 'focus');
            simulateOn('input[name^="employer"] ~ ul li:first-child', 'mousedown', { button: 0 });
            simulateOn('input[name^="local"]', 'focus');
            expect(document.querySelector('input[name^="local"] ~ ul')).toMatchSnapshot();
            done();
        });
    });

    it('redirects on submit with all field values', async done => {
        await mount();
        // wait for setState and its callback to finish at end of promise
        process.nextTick(() => {
            simulateOn('input[name^="location"]', 'focus');
            simulateOn('input[name^="location"] ~ ul li:first-child', 'mousedown', { button: 0 });
            simulateOn('input[name^="employer"]', 'focus');
            simulateOn('input[name^="employer"] ~ ul li:first-child', 'mousedown', { button: 0 });
            simulateOn('input[name^="local"]', 'focus');
            simulateOn('input[name^="local"] ~ ul li:first-child', 'mousedown', { button: 0 });

            global.parent.location.assign = jest.fn();
            simulateOn('button[type="submit"]', 'click');
            expect(global.parent.location.assign).toHaveBeenCalledWith(
                'http://localhost/submit?employer=3&local=1&location=IA&key=API_KEY&token=TOKEN'
            );
            done();
        });
    });
});
