import React from 'react';
import PropTypes from 'prop-types';


function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}


export class SearchInput extends React.Component {

  static propTypes = {
    onSearch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { value: '' }
    this.textInput = React.createRef();

    this.handleSearch = debounce(props.onSearch, 500);
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value
    });

    this.handleSearch(event.target.value);
  }

  handleKeyDown = (e) => {
    if (
      e.key !== "Enter" &&
      e.key !== "Tab" &&
      e.key !== "Shift"
    ) {
      this.textInput.current.focus();
    }
  }

  render = () => {
    return (
      <div className="form-group row">
        <label htmlFor="search" className="col-sm-2 col-form-label">SKU</label>
        <div className="col-sm-10">
          <input
            type="text"
            ref={this.textInput}
            placeholder="ingrese sku"
            className="form-control"
            id="search"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}
