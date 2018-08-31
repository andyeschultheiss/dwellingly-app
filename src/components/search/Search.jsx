import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon/Icon';

import './Search.scss';

class Search extends Component {
  constructor(props) {
    super(props)

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleShowOptionsList = this.handleShowOptionsList.bind(this);
    this.handleHideOptionsList = this.handleHideOptionsList.bind(this);

    this.state = {
      // searchResult: '',
      searchTerm: '',
      pastSearch: '',
      focus: null
    }
  }


  handleBlur(event) {
    if(this.node && this.node.contains(event.target)) {
      return
    }
    this.handleFocus();
  }

  handleFocus() {
    const { focus } = this.state;
    if(focus) {
      this.handleHideOptionsList();
    } else {
      this.handleShowOptionsList();
    }
  }

  handleShowOptionsList() {
    // console.log('SHOW OPTIONS');
    // If the keydown is === to 'tab' run the function
    document.addEventListener("click", this.handleBlur, false);
    document.addEventListener("keyup", this.handleBlur, false);
    // document.addEventListener("keydown", (e) => {
    //   if(e.keyCode === 9 || e.which === 'tab') {
    //     this.handleBlur();
    //   }
    // }, false);
    this.setState({ focus: true });
  }

  handleHideOptionsList() {
    // console.log('HIDE OPTIONS');
    document.removeEventListener("click", this.handleBlur, false);
    document.removeEventListener("keyup", this.handleBlur, false);
    // document.removeEventListener("keydown", (e) => {
    //   if(e.keyCode === 9 || e.which === 'tab') {
    //     this.handleBlur();
    //   }
    // }, false);
    this.setState({ focus: false });
  }

  handleSelection(searchedObj) {
    const { name, address } = searchedObj
    const searchedResult = `${name} ${address}`
    this.props.onSearchSelection(searchedObj)
    this.setState({ searchTerm: '' });
    this.setState({ pastSearch: searchedResult })
    this.handleHideOptionsList();
  }

  handleSearch(event) {
    const { target } = event;
    const { value } = target;

    // this.setState({ searchResult: ''})
    // this.setState({ pastSearch: '' })

    this.setState({
      searchTerm: value
    });
  }

  render() {
    const { searchData } = this.props;
    const { pastSearch, focus, searchTerm } = this.state;
    const filterSearch = searchData.filter(data => {
      const dataString = Object.values(data).join(' ').toLowerCase();
      return dataString.includes(searchTerm)
    })
    return (
      <div className="searchContainer">
        <div className="searchContainerInner" ref={node => { this.node = node }}>
          <input
            type="text"
            className="searchBar"
            placeholder={!pastSearch ? "Search" : pastSearch}
            onFocus={this.handleFocus}
            onChange={this.handleSearch}
            value={searchTerm} />
          <span><Icon icon="arrowRight" /></span>
          {(searchTerm && focus) && (
            <div className="searchResultsContainer">
              {filterSearch.map(data =>
                <button
                  key={data.id}
                  id="searchResult"
                  type="button"
                  aria-label={`searchResult - ${data.name}`}
                  className="results"
                  onClick={() => this.handleSelection(data)}>
                  {data.name} {data.address}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

Search.propTypes = {
  onSearchSelection: PropTypes.func.isRequired,
  searchData: PropTypes.arrayOf(PropTypes.object).isRequired
}


export default Search
