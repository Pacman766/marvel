import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {
  const [charList, setCharlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(1541); // 210
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest();
  }, []);

  // making request, getting all chars from marvelService and getting new charList  with offset, if the buttons clicked
  const onRequest = (offset) => {
    onChartrListLoading();
    marvelService
      .getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError);
  };

  // getting new chars list
  const onChartrListLoading = () => {
    setNewItemLoading(true);
  };

  // checking if list of chars ended or getting +9 new chars
  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharlist((charList) => [...charList, ...newCharList]);
    setLoading((loading) => false);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  // setting error and removing  loading
  const onError = () => {
    setError(true);
    setLoading(false);
  };

  // empty arr for refs
  const itemRefs = useRef([]);

  // remove selection from all chars, add selection by id for selected char
  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove('char__item_selected')
    );
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  };

  // configure each character with style, specific id, img and name
  function renderItems(arr) {
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
          ref={(el) => (itemRefs.current[i] = el)}
          key={item.id}
          // selection of char by clicking of key press
          onClick={() => {
            props.onCharSelected(item.id);
            focusOnItem(i);
          }}
          //
          onKeyPress={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              props.onCharSelected(item.id);
              focusOnItem(i);
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

  const items = renderItems(charList);

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
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

// validation of function onCharSelected
CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
