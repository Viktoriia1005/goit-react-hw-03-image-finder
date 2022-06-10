import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import s from './Searchbar.module.css';

export default class Searchbar extends Component {
  state = { searchInfo: '' };

  handleNameChange = event => {
    this.setState({ searchInfo: event.currentTarget.value.toLowerCase() });
  };

  handleSubmit = e => {
    e.preventDefault();

    if (this.state.searchInfo.trim() === '') {
      return toast.error('Enter your search term!');
    }
    this.props.onSubmit(this.state.searchInfo);
    this.setState({ searchInfo: '' });
  };

  render() {
    return (
      <header className={s.Searchbar}>
        <form onSubmit={this.handleSubmit} className={s.SearchForm}>
          <button type="submit" className={s.SearchFormButton}></button>

          <input
            className={s.SearchFormInput}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={this.state.searchInfo}
            onChange={this.handleNameChange}
          />
        </form>
      </header>
    );
  }
}
