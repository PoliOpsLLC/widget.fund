(function() {
    const container = document.createElement('iframe');
    const { key, location, employer, local, style, text } = document.currentScript.dataset;
    container.srcdoc = `
        <script src="${process.env.SCRIPT_DOMAIN}/button.${process.env.RELEASE_NAME || window.version}.js"></script>
        <script>window.init(${JSON.stringify({ key, location, employer, local, text, style })})</script>
    `;
    container.width = document.currentScript.dataset.width;
    container.height = document.currentScript.dataset.height;
    container.style.border = 0;
    document.currentScript.insertAdjacentElement('afterend', container);
})();
