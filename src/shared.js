export const packParams = params => {
    return Object.keys(params).map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }).join('&');
};

export const bootstrap = (key, errorMessage = 'something went wrong') => {
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
        .then(r => r.json(), handleError)
        .catch(handleError);
};
