import { bootstrap, packParams } from './shared';

window.init = config => {
    bootstrap(config.key).then(data => {
        const prefill = Object.keys(config).reduce((filled, key) => {
            if (config[key]) filled[key] = config[key];
            return filled;
        }, {});
        const destination = `${data.submit_url}?${packParams({ ...prefill, token: data.token })}`;
        window.location.assign(destination);
    });
};
