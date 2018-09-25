(function() {
    var button = document.createElement('button');
    button.setAttribute('data-pledgeup-button', true);
    button.innerHTML = 'preloaded button';

    var transfer = function(target, attr) {
        target.setAttribute(attr, document.currentScript.getAttribute(attr));
    };

    transfer(button, 'data-pledgeup-location');
    transfer(button, 'data-pledgeup-employer');
    transfer(button, 'data-pledgeup-local');

    document.currentScript.insertAdjacentElement('afterend', button);
})();
