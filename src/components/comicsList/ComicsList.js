import { useState, useEffect } from 'react';
import useMarvelService from '../../services/;MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(1541);
  const [comicsEnded, setComicsended] = useState(false);

  const [loading, error, getAllComics] = useMarvelService();

  useEffect(() => {}, []);

  return (
    <div className="comics__list">
      <ul className="comics__grid"></ul>
      <button className="button button__main button__long">
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
