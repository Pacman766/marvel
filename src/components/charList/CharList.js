import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 1541,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }
  // making request, getting all chars from marvelService and getting new charList  with offset, if the buttons clicked
  onRequest = (offset) => {
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  // getting new chars list
  onChartrListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  // checking if list of chars ended or getting +9 new chars
  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  // setting error and removing  loading
  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  // empty arr for refs
  itemRefs = [];

  // setting ref for selected char
  setRef = (ref) => {
    this.itemRefs.push(ref);
  };

  // remove selection from all chars, add selection by id for selected char
  focusOnItem = (id) => {
    this.itemRefs.forEach((item) =>
      item.classList.remove('char__item_selected')
    );
    this.itemRefs[id].classList.add('char__item_selected');
    this.itemRefs[id].focus();
  };

  // configure each character with style, specific id, img and name
  renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: 'cover' };
      if (
        item.thumbnail ===
        'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
      ) {
        imgStyle = { objectFit: 'unset' };
      }
      return (
        <li
          className="char__item"
          tabIndex={0}
          ref={this.setRef}
          key={item.id}
          // selection of char by clicking of key press
          onClick={() => {
            this.props.onCharSelected(item.id);
            this.focusOnItem(i);
          }}
          //
          onKeyPress={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              this.props.onCharSelected(item.id);
              this.focusOnItem(i);
            }
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    return <ul className="char__grid">{items}</ul>;
  }

  render() {
    const { charList, loading, error, newItemLoading, offset, charEnded } =
      this.state;
    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    // if not error or loading, show View comp, else - null
    const content = !(error || loading) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          // if charlist ended, setting display to none, else - block
          style={{ display: charEnded ? 'none' : 'block' }}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

// validation of function onCharSelected
CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
