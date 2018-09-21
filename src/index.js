import './style.css';

import { h, render } from 'preact';
import fetch from 'unfetch';

import Form from './form';

window.initializeWidget = config => {
    const handleError = err => {
        const error = document.createElement('div');
        error.innerHTML = `unable to initialize widget with key: ${config.apiKey}`;
        document.body.appendChild(error);
        console.log(err);
    };

    const packParams = params => {
        return Object.keys(params).map(key => {
            return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
        }).join('&');
    };

    const options = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: packParams({ key: config.apiKey }),
    };

    fetch(`${process.env.API_URL}${process.env.BOOTSTRAP_ENDPOINT}`, options)
        .then(r => r.json(), handleError)
        .then(data => {
            return render(
                <Form packParams={packParams} {...config} {...data} />,
                document.body,
                document.body.lastElementChild,
            );
        })
        .catch(handleError);
};
