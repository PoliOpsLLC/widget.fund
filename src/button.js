import { bootstrap, packParams } from './shared';

window.init = config => {
    bootstrap(config.key).then(data => {
        const prefill = Object.keys(config).reduce((filled, key) => {
            if (['text'].indexOf(key) && config[key]) filled[key] = config[key];
            return filled;
        }, {});

        const button = document.createElement('button');
        button.onclick = evt => {
            const destination = `${data.submit_url}?${packParams({ ...prefill, token: data.token })}`;
            window.parent.location.assign(destination);
        };
        button.innerHTML = config.text;

        document.body.appendChild(button);
    });
};
