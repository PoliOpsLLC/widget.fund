import { h, Component } from 'preact';

import Awesomplete from 'awesomplete';

export default class Typeahead extends Component {
    constructor(props) {
        super(props);
        this._awesomplete = null;
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        this._awesomplete = new Awesomplete(this._input, {
            minChars: 0,
            maxItems: 5,
            replace: option => (this._input.value = option.label),
        });

        this._input.addEventListener('awesomplete-selectcomplete', evt => {
            evt.preventDefault();
            const valid = this._awesomplete._list.find(option => {
                return evt.target.value === option.label;
            });
            if (valid) {
                this.props.onSelect(valid.value);
                this._awesomplete.close();
            }
            return false;
        });

        if (this.props.onInput) {
            this._input.addEventListener('input', evt => {
                return this.props.onInput(evt.target.value);
            });
        }
    }

    componentWillUnmount() {
        this._awesomplete.destroy();
    }

    updateList = newList => {
        this._awesomplete._list = newList;
        this._awesomplete.isOpened && this._awesomplete.evaluate();
    }

    render() {
        // Chrome really doesn't respect autocomplete="off" and other
        // solutions to disable autofilling fields, so avoid autofill
        // detection by changing the input name every render
        const name = `${this.props.name}-${Date.now()}`;
        return (
            <div class="typeahead">
                <label for={name}>{this.props.label}</label>
                <input
                    name={name}
                    onFocus={() => {
                        if (!this._awesomplete) return;
                        this.props.onOpen(this.updateList);
                        this._awesomplete.evaluate();
                    }}
                    onBlur={() => this._awesomplete && this._awesomplete.close()}
                    ref={el => (this._input = el)} />
            </div>
        );
    }
}
