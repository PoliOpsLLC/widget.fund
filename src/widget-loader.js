window.pledgeupWidget = (options = {}) => {
    const config = {
        selector: '[data-pledgeup-widget]',
        version: process.env.RELEASE_NAME,
        customStyle: '',
        height: '470px',
        width: '300px',
        introMessage: 'Each one of the fields below help narrow down which organization the member belongs to.',
        summaryMessage: 'Submitting will take what has been entered and redirect the member to the matched organization forms to complete their sign up process.',
        locationLabel: 'State of Employment',
        employerLabel: 'Employer',
        localLabel: 'Affiliate/Local',
        showLocation: true,
        showEmployer: true,
        showLocal: true,
        submitLabel: 'Submit',
        ...options,
    };

    document.querySelectorAll(config.selector).forEach(node => {
        const container = document.createElement('iframe');
        container.srcdoc = `
            ${config.customStyle ? `<style>${config.customStyle}</style>` : ''}
            <script src="${process.env.SCRIPT_DOMAIN}/widget.${config.version}.js"></script>
            <script>window.init(${JSON.stringify(config)})</script>
        `;
        container.width = config.width;
        container.height = config.height;
        container.style.border = 0;
        node.appendChild(container);
    });
};
