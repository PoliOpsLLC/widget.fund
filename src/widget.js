window.pledgeupWidget = (options = {}) => {
    const config = {
        selector: '[data-pledgeup-widget]',
        version: process.env.RELEASE_NAME || '',
        customStyle: '',
        height: '470px',
        width: '300px',
        ...options,
    };

    document.querySelectorAll(config.selector).forEach(node => {
        const container = document.createElement('iframe');
        container.srcdoc = `
            ${config.customStyle ? `<style>${config.customStyle}</style>` : ''}
            <script src="app.${config.version}.js"></script>
            <script>window.initializeWidget(${JSON.stringify(config)})</script>
        `;
        container.width = config.width;
        container.height = config.height;
        container.style.border = 0;
        node.appendChild(container);
    });
};
