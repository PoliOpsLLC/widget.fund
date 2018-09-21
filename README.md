# Member Driver

[![CircleCI](https://circleci.com/gh/PoliOpsLLC/widget.fund.svg?style=svg&circle-token=106f63f42cbc6494a70c56d603c40dbfba8cdb0c)](https://circleci.com/gh/PoliOpsLLC/widget.fund)

Embedded JS widget powered by https://pledgeup.com/ to help members sign up.

## Installation

Installing the widget is divided into three main parts:

 1. Add the widget script to your page:

```html
<script src="https://prod.memberdriver.com/widget.js"></script>
```

 2. Ensure the element you want the widget to load into on your page has the special attribute the widget can find. This attribute can be overridden as described in the configuration section:

 ```html
 <div class="sidebar">
     <div class="sample-placeholder" data-pledgeup-widget></div>
 </div>
 ```

 3. Once the widget script has been loaded on the page, the `window.pledgeupWidget` function should be available to call with a configuration object to initialize the widget. An `apiKey` is the only required configuration option and will authorize the page to use the widget. This can either be run in a separate `<script>` tag or from other javascript files loaded on the page so long as they load after `widget.js` from step 1.

```javascript
window.pledgeupWidget({ apiKey: 'API_KEY' });
```

## Configuration

There are many options available to further configure the widget. All optional settings have sensible defaults, simply pass them in alongside the required `apiKey` in the config object to override those defaults. The available options are as follow:

| Name | Description | Default |
| --- | --- | --- |
| selector | CSS selector used to find container element for widget | `'[data-pledgeup-widget]'` |
| version | specific version of widget to load | `'current'` |
| customStyle | CSS overrides to default styling within the widget | `''` |
| height | how tall the widget should be when loaded | `470px` |
| width | how wide the widget should be when loaded | `300px` |

## License

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
