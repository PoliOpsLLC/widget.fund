import './style.css';

import { h, Component } from 'preact';

import fetch from 'unfetch';

import { debounce, packParams } from './shared';
import Typeahead from './typeahead';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employer: '',
            local: '',
            location: '',
            employerOptions: [],
            localOptions: [],
            locationOptions: [],
        };
    }

    getAccessParams() {
        return { key: this.props.apiKey, token: this.props.token };
    }

    fetchOptions = (url, params, name, label, value) => {
        return fetch(`${url}?${packParams(params)}`, { credentials: 'include' })
            .then(resp => resp.json())
            .then(data => {
                return this.setState({
                    [`${name}Options`]: data.results.map(result => ({
                        ...result,
                        label: result[label],
                        value: result[value],
                    })),
                }, this.constrainOptions);
            });
    }

    loadLocations() {
        const params = this.getAccessParams();
        return this.props.showLocation ?
            this.fetchOptions(this.props.location_url, params, 'location', 'display_name', 'value') :
            Promise.resolve();
    }

    loadEmployers(name) {
        const params = { ...this.getAccessParams(), name };
        return this.props.showEmployer ?
            this.fetchOptions(this.props.employer_url, params, 'employer', 'name', 'pk') :
            Promise.resolve();
    }

    loadLocals(name) {
        const params = { ...this.getAccessParams(), name };
        return this.props.showLocal ?
            this.fetchOptions(this.props.local_url, params, 'local', 'name', 'pk') :
            Promise.resolve();
    }

    componentDidMount() {
        return Promise.all([this.loadLocations(), this.loadEmployers(), this.loadLocals()]);
    }

    constrainEmployers() {
        const constrained = this.state.employerOptions.filter(option => {
            let valid = true;
            if (option && option.address && option.address.state && this.state.location) {
                valid = option.address.state === this.state.location;
            }
            const local = this.state.localOptions.find(l => l.value === this.state.local);
            if (local && local.employers.length) {
                valid = local.employers.indexOf(option.value) > -1;
            }
            return valid;
        });
        this._employer.updateList(constrained);
    }

    constrainLocals() {
        const constrained = this.state.localOptions.filter(option => {
            let valid = true;
            if (option && option.address && option.address.state && this.state.location) {
                valid = option.address.state === this.state.location;
            }
            const employer = this.state.employerOptions.find(e => e.value === this.state.employer);
            if (employer && employer.locals.length) {
                valid = employer.locals.indexOf(option.value) > -1;
            }
            return valid;
        });
        this._local.updateList(constrained);
    }

    constrainOptions() {
        this.props.showLocation && this._location.updateList(this.state.locationOptions);
        this.props.showEmployer && this.constrainEmployers();
        this.props.showLocal && this.constrainLocals();
    }

    handleInput = loader => {
        return debounce(loader.bind(this), 400);
    };

    handleOpen = field => () => {
        return this.constrainOptions();
    }

    handleSelect = field => value => {
        return this.setState({ [field]: value }, this.constrainOptions);
    }

    handleSubmit = evt => {
        evt.preventDefault();
        const { apiKey, token } = this.props;
        const { employer, local, location } = this.state;
        const params = packParams({ employer, local, location, key: apiKey, token });
        window.parent.location.assign(`${this.props.submit_url}?${params}`);
        return false;
    }

    render() {
        return (
            <div class="content">
                <p>{this.props.introMessage}</p>
                <form onSubmit={this.handleSubmit}>
                    { this.props.showLocation &&
                        <Typeahead
                            ref={el => (this._location = el)}
                            name="location"
                            label={this.props.locationLabel}
                            options={this.state.locationOptions}
                            onOpen={this.handleOpen('location')}
                            onSelect={this.handleSelect('location')} /> }

                    { this.props.showEmployer &&
                        <Typeahead
                            ref={el => (this._employer = el)}
                            name="employer"
                            label={this.props.employerLabel}
                            options={this.state.employerOptions}
                            onInput={this.handleInput(this.loadEmployers)}
                            onOpen={this.handleOpen('employer')}
                            onSelect={this.handleSelect('employer')} /> }

                    { this.props.showLocal &&
                        <Typeahead
                            ref={el => (this._local = el)}
                            name="local"
                            label={this.props.localLabel}
                            options={this.state.localOptions}
                            onInput={this.handleInput(this.loadLocals)}
                            onOpen={this.handleOpen('local')}
                            onSelect={this.handleSelect('local')} /> }

                    <p>{this.props.summaryMessage}</p>
                    <button type="submit">{this.props.submitLabel}</button>
                </form>
            </div>
        );
    }
}
