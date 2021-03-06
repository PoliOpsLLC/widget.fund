# Member Driver

[![GitHub release](https://img.shields.io/github/release/PoliOpsLLC/widget.fund.svg)](https://github.com/PoliOpsLLC/widget.fund/releases) ![CircleCI](https://circleci.com/gh/PoliOpsLLC/widget.fund.svg?style=shield&circle-token=106f63f42cbc6494a70c56d603c40dbfba8cdb0c)

Embedded integrations with https://pledgeup.com/ to help guide members to sign up.

There are two types of integrations available to choose from:

 * Widget - An embedded set of typeahead fields that narrow down which organization a member belongs in, with a submit button that will redirect them to their next steps based on the entered typeahead information.
 * Button - A preconfigured button set to send a member to a particular formset for sign up based on the information available in the Widget typeaheads.

## Installation

The Widget and Button vary in configuration and installation, but all require an API key to initialize correctly.

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
| introMessage | Text to be displayed prior to the typeahead fields | `''` |
| summaryMessage | Text to be displayed after the typeahead fields before the submit button | `''` |
| locationLabel | Field label for the location field | `'State of Employment'` |
| employerLabel | Field label for the employer field | `'Employer'` |
| localLabel | Field label for the local field | `'Affiliate/Local'` |
| showLocation | Whether to show or hide the location field | `true` |
| showEmployer | Whether to show or hide the employer field | `true` |
| showLocal | Whether to show or hide the local field | `true` |
| submitLabel | Submit button text | `'Submit'` |

### Button

All the following options are optional and included in the button snippet creator

| Name | Description | Default |
| --- | --- | --- |
| location | US state to prefill on profile | `''` |
| employer | Employer name to prefill on profile | `''` |
| local | Local name to prefill on profile | `''` |
| customStyle | CSS overrides to default styling on the button | `''` |
| text | Text to display in the button | `Sign Up` |

## Contributing

There are a number of environment variables that must be set to develop correctly. These are altered during deployment to alpha and production environments by CircleCI. They should be set in whichever shell is going to run `npm start` or `yarn start`. A sample with defaults has been provided at `.env.sample`.

 * `API_URL` - location of the union.fund instance to use as the base endpoint for API calls
 * `BOOTSTRAP_ENDPOINT` - path of union.fund API endpoint to gain token used to sign API calls with
 * `GITHUB_API_TOKEN` - [personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) used when creating new prelease/release deployments to Github
 * `SCRIPT_DOMAIN` - location of widget.fund instance

Other environment variables are referenced throughout the code and scripts related to AWS products but should only matter when deploying via CircleCI.

A collection of scripts noted in `package.json` should take care of all local development needs:

 * `npm start` - run a development server on port 8080
 * `npm test` - run automated test suite
 * `npm visualize` - use [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) to visualize bundle size and distribution

The [git flow](https://nvie.com/posts/a-successful-git-branching-model/) branching model is roughly followed, leading pushes to `develop` to deploy the alpha environment via CircleCI and pushes to `master` deploy production. Versions of the integrations testing forms as built in `index.html` are available at `alpha.memberdriver.com` and `prod.memberdriver.com` respectively for testing against alpha/prod deployments.

## License

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://mit-license.org/)
