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

  static Type = {
    barcode: 'barcode',
    search: 'search'
  }

  static propTypes = {
    onSearch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { value: '', type: SearchInput.Type.search };
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

    if (e.key === "Enter") {
      e.target.select();
    }
  }

  changeType = () => {
    let other = this.state.type === SearchInput.Type.search ? SearchInput.Type.barcode:SearchInput.Type.search;
    this.setState({ type: other, value: '' });
    this.props.onTypeChange(other);
  }

  render = () => {
    return (
      <div className="form-group row no-gutters">
        <div className="col">
          <div className="input-group mb-3">
            <input
              type="text"
              ref={this.textInput}
              placeholder={this.state.type === SearchInput.Type.barcode ?'leer código':'ingresar búsqueda'}
              className="form-control"
              id="search"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <div className="input-group-append">
              <span className="input-group-text" >
                <i className={`fas ${this.state.type === SearchInput.Type.search ? 'fa-search':'fa-barcode'}`}/>
              </span>
            </div>
          </div>
        </div>
        <div className="col-auto" >
          <button type="button" className="btn btn-link" onClick={this.changeType} >
            <i className="fas fa-sync"></i>
          </button>
        </div>
      </div>
    );
  }
}
