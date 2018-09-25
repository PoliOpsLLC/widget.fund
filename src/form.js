import './style.css';

import { h, Component } from 'preact';

import fetch from 'unfetch';

import { packParams } from './shared';
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

    loadOptions = (url, name, label, value) => {
        const params = { 'key': this.props.apiKey, 'token': this.props.token };
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

    componentDidMount() {
        return Promise.all([
            this.loadOptions(this.props.location_url, 'location', 'display_name', 'value'),
            this.loadOptions(this.props.employer_url, 'employer', 'name', 'pk'),
            this.loadOptions(this.props.local_url, 'local', 'name', 'pk'),
        ]);
    }

    constrainEmployers() {
        const constrained = this.state.employerOptions.filter(option => {
            let valid = true;
            if (option && option.address && option.address.state && this.state.location) {
                valid = option.address.state === this.state.location;
            }
            const local = this.state.localOptions.find(l => l.value === this.state.local);
            if (local) {
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
            if (employer) {
                valid = employer.locals.indexOf(option.value) > -1;
            }
            return valid;
        });
        this._local.updateList(constrained);
    }

    constrainOptions() {
        this._location.updateList(this.state.locationOptions);
        this.constrainEmployers();
        this.constrainLocals();
    }

    handleOpen = field => () => {
        return this.constrainOptions();
    }

    handleChange = field => value => {
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
                <h3>This is the widget form</h3>
                <p>Each one of the fields below help narrow down which organization the member belongs to.</p>
                <form onSubmit={this.handleSubmit}>
                    <Typeahead
                        ref={el => (this._location = el)}
                        name="location"
                        label="State of Employment"
                        options={this.state.locationOptions}
                        onOpen={this.handleOpen('location')}
                        onChange={this.handleChange('location')} />

                    <Typeahead
                        ref={el => (this._employer = el)}
                        name="employer"
                        label="Employer"
                        options={this.state.employerOptions}
                        onOpen={this.handleOpen('employer')}
                        onChange={this.handleChange('employer')} />

                    <Typeahead
                        ref={el => (this._local = el)}
                        name="local"
                        label="Affiliate/Local"
                        options={this.state.localOptions}
                        onOpen={this.handleOpen('local')}
                        onChange={this.handleChange('local')} />

                    <p>Submitting will take what has been entered and redirect the member to the matched organization's forms to complete their sign up process.</p>
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}
