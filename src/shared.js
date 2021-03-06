import fetch from 'unfetch';

export const bootstrap = (key, errorMessage = 'oops!') => {
    const handleError = err => {
        const error = document.createElement('span');
        error.innerHTML = errorMessage;
        document.body.appendChild(error);
        console.log(err);
    };

    const options = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: packParams({ key }),
    };

    return fetch(`${process.env.API_URL}${process.env.BOOTSTRAP_ENDPOINT}`, options)
        .then(resp => {
            if (!resp.ok) throw Error(resp.statusText);
            return resp.json();
        })
        .catch(handleError);
};

export const debounce = (fn, delay) => {
    let timeoutID = null;
    return (...args) => {
        clearTimeout(timeoutID);
        const that = this;
        timeoutID = setTimeout(() => fn.apply(that, args), delay);
    };
};

export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

export const packParams = params => {
    return Object.keys(params).reduce((qs, key) => {
        // strips param if value is undefined, null, '', or 0
        return !params[key] ? qs : qs.concat(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }, []).join('&');
};

export const simulateOn = (target, name, props = {}) => {
    const node = document.querySelector(target);
    const event = new Event(name, { bubbles: true });
    Object.assign(event, props);
    node.dispatchEvent(event);
};

export default { bootstrap, flushPromises, packParams, simulateOn };
