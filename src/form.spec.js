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
                    { address: { state: 'IA' }, locals: [812], name: 'INDEPENDENCE MENTAL HEALTH FACILITY', pk: 543 },
                    { address: { state: 'LA' }, locals: [], name: 'Louisiana Department of Health (LDH)', pk: 546 },
                    { address: { state: 'LA' }, locals: [814], name: 'Louisiana State Penitentiary (LSP)', pk: 547 },
                ],
            });
        nock('http://localhost').get('/local').query(true)
            .reply(200, {
                results: [
                    { address: { state: 'LA' }, employers: [547], name: 'Council 17: Local 3056', pk: 814 },
                    { address: { state: 'IA' }, employers: [], name: 'Council 61: Local 12', pk: 813 },
                    { address: { state: 'IA' }, employers: [543], name: 'Council 61: Local 2987', pk: 812 },
                    { address: null, employers: [], name: 'Council 61: Local 2998', pk: 811 },
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
            simulateOn('input[name="employer"]', 'focus');
            expect(document.querySelector('input[name="employer"] ~ ul')).toMatchSnapshot();

            simulateOn('input[name="location"]', 'focus');
            simulateOn('input[name="location"] ~ ul li:last-child', 'mousedown', { button: 0 });
            simulateOn('input[name="employer"]', 'focus');
            expect(document.querySelector('input[name="employer"] ~ ul')).toMatchSnapshot();

            simulateOn('input[name="local"]', 'focus');
            simulateOn('input[name="local"] ~ ul li:first-child', 'mousedown', { button: 0 });
            simulateOn('input[name="employer"]', 'focus');
            expect(document.querySelector('input[name="employer"] ~ ul')).toMatchSnapshot();
            done();
        });
    });

    it('constrains locals based on state/employer', async done => {
        await mount();
        // wait for setState and its callback to finish at end of promise
        process.nextTick(() => {
            simulateOn('input[name="local"]', 'focus');
            expect(document.querySelector('input[name="local"] ~ ul')).toMatchSnapshot();

            simulateOn('input[name="location"]', 'focus');
            simulateOn('input[name="location"] ~ ul li:first-child', 'mousedown', { button: 0 });
            simulateOn('input[name="local"]', 'focus');
            expect(document.querySelector('input[name="local"] ~ ul')).toMatchSnapshot();

            simulateOn('input[name="employer"]', 'focus');
            simulateOn('input[name="employer"] ~ ul li:first-child', 'mousedown', { button: 0 });
            simulateOn('input[name="local"]', 'focus');
            expect(document.querySelector('input[name="local"] ~ ul')).toMatchSnapshot();
            done();
        });
    });

    it('redirects on submit with all field values', async done => {
        await mount();
        // wait for setState and its callback to finish at end of promise
        process.nextTick(() => {
            simulateOn('input[name="location"]', 'focus');
            simulateOn('input[name="location"] ~ ul li:first-child', 'mousedown', { button: 0 });
            simulateOn('input[name="employer"]', 'focus');
            simulateOn('input[name="employer"] ~ ul li:first-child', 'mousedown', { button: 0 });
            simulateOn('input[name="local"]', 'focus');
            simulateOn('input[name="local"] ~ ul li:first-child', 'mousedown', { button: 0 });

            global.parent.location.assign = jest.fn();
            simulateOn('button[type="submit"]', 'click');
            expect(global.parent.location.assign).toHaveBeenCalledWith(
                'http://localhost/submit?employer=543&local=812&location=IA&key=API_KEY&token=TOKEN'
            );
            done();
        });
    });
});
