import { bootstrap, packParams } from './shared';

window.init = config => {
    bootstrap(config.key).then(data => {
        const prefill = Object.keys(config).reduce((filled, key) => {
            if (['customStyle', 'text'].indexOf(key) && config[key]) filled[key] = config[key];
            return filled;
        }, {});

        const button = document.createElement('button');
        button.onclick = evt => {
            const destination = `${data.submit_url}?${packParams({ ...prefill, token: data.token })}`;
            window.parent.location.assign(destination);
        };
        button.style = config.customStyle || '';
        button.innerHTML = config.text || 'Sign Up';

        document.body.appendChild(button);
    });
};
