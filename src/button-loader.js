(function() {
    const container = document.createElement('iframe');
    const { customStyle, key, location, employer, local, text } = document.currentScript.dataset;
    container.srcdoc = `
        <script src="${process.env.SCRIPT_DOMAIN}/button.${process.env.RELEASE_NAME || window.buttonVersion}.js"></script>
        <script>window.init(${JSON.stringify({ customStyle, key, location, employer, local, text })})</script>
    `;
    container.width = document.currentScript.dataset.width;
    container.height = document.currentScript.dataset.height;
    container.style.border = 0;
    document.currentScript.insertAdjacentElement('afterend', container);
})();
