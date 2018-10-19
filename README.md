# Member Driver

[![GitHub release](https://img.shields.io/github/release/PoliOpsLLC/widget.fund.svg)](https://github.com/PoliOpsLLC/widget.fund/releases) ![CircleCI](https://circleci.com/gh/PoliOpsLLC/widget.fund.svg?style=shield&circle-token=106f63f42cbc6494a70c56d603c40dbfba8cdb0c)

Embedded integrations with https://pledgeup.com/ to help guide members to sign up.

There are three types of integrations available to choose from:

 * Widget - An embedded set of typeahead fields that narrow down which organization a member belongs in, with a submit button that will redirect them to their next steps based on the entered typeahead information.
 * Button - A preconfigured button set to send a member to a particular formset for sign up based on the information available in the Widget typeaheads.
 * IFrame - A preconfigured IFrame set to display the destination profile page in the Widget and Button integrations directly inline.

## Installation

The Widget, Button, and IFrame vary in configuration and installation, but all require an API key to initialize correctly.

### Widget

Installing the widget is divided into three main parts:

 1. Add the widget loader script to your page:

```html
<script src="https://prod.memberdriver.com/widgetLoader.js"></script>
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

### Button

Installing the button on your page is as simple as embedding the button loader script. The button will load wherever the script is placed, so ensure it's positioned in the layout appropriately. PledgeUp hosts a button snippet creator where it can be configured and generate the script tag you need to embed, which should look similar to this:

```html
<script src="https://prod.memberdriver.com/buttonLoader.js"></script>
```

### IFrame

Much the same as the Button, a single iframe loader script needs to be embedded where the inline member profile should show. PledgeUp hosts an iframe snippet creator where it can be configured and generate the script tag you need to embed, which should look similar to this:

```html
<script src="https://prod.memberdriver.com/iframeLoader.js"></script>
```

## Configuration

### Widget

There are many options available to further configure the widget. All optional settings have sensible defaults, simply pass them in alongside the required `apiKey` in the config object to override those defaults. The available options are as follow:

| Name | Description | Default |
| --- | --- | --- |
| selector | CSS selector used to find container element for widget | `'[data-pledgeup-widget]'` |
| version | specific version of widget to load | `'current'` |
| customStyle | CSS overrides to default styling within the widget | `''` |
| height | how tall the widget should be when loaded | `470px` |
| width | how wide the widget should be when loaded | `300px` |

### Button

All the following options are optional and included in the button snippet creator

| Name | Description | Default |
| --- | --- | --- |
| location | US state to prefill on profile | `''` |
| employer | Employer name to prefill on profile | `''` |
| local | Local name to prefill on profile | `''` |
| customStyle | CSS overrides to default styling on the button | `''` |
| text | Text to display in the button | `Sign Up` |

### IFrame

All the following options are optional and included in the iframe snippet creator

| Name | Description | Default |
| --- | --- | --- |
| location | US state to prefill on profile | `''` |
| employer | Employer name to prefill on profile | `''` |
| local | Local name to prefill on profile | `''` |
| height | how tall the iframe should be when loaded | `480px` |
| width | how wide the iframe should be when loaded | `640px` |

## License

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://mit-license.org/)
