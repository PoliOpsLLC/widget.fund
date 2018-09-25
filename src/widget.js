import './style.css';

import { h, render } from 'preact';

import { bootstrap } from './shared';
import Form from './form';

window.init = config => {
    const errorMessage = `unable to initialize widget with key: ${config.apiKey}`;
    bootstrap(config.apiKey, errorMessage).then(data => {
        return render(
            <Form {...config} {...data} />,
            document.body,
            document.body.lastElementChild,
        );
    });
};
