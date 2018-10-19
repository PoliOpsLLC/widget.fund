(function(window, document) {
    const container = document.createElement('iframe');
    const { key, location, employer, local, org, height, width } = document.currentScript.dataset;
    container.srcdoc = `
        <script src="${process.env.SCRIPT_DOMAIN}/iframe.${process.env.RELEASE_NAME || window.version}.js"></script>
        <script>window.init(${JSON.stringify({ key, location, employer, local, org })})</script>
    `;
    container.width = width || 480;
    container.height = height || 640;
    container.style.border = 0;
    document.currentScript.insertAdjacentElement('afterend', container);
})(window, document);
