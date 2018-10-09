import { bootstrap, packParams } from './shared';

window.init = config => {
    bootstrap(config.key).then(data => {
        const prefill = Object.keys(config).reduce((filled, key) => {
            if (['style', 'text'].indexOf(key) && config[key]) filled[key] = config[key];
            return filled;
        }, {});

        const button = document.createElement('button');
        button.onclick = evt => {
            const destination = `${data.submit_url}?${packParams({ ...prefill, token: data.token })}`;
            window.parent.location.assign(destination);
        };
        button.style = config.style || '';
        button.innerHTML = config.text || 'Sign Up';

        document.body.style.margin = 0;
        document.body.appendChild(button);
    });
};
