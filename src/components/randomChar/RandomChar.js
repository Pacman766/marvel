import { Component } from 'react';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class RandomChar extends Component {
  state = {
    char: {},
    loading: true,
    error: false,
  };

  marvelService = new MarvelService();

  onCharLoading = () => {
    this.setState({
      loading: true,
    });
  };

  // setting state of character and setting loading - false
  onCharLoaded = (char) => {
    this.setState({ char, loading: false });
  };

  // if no character with such id show error
  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  // setting hook of mounting char comp
  componentDidMount() {
    this.updateChar();
    // this.timerId = setInterval(this.updateChar, 3000);
  }

  // setting hook of Unmounting char comp
  // by clearing intercal
  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  // updating random character
  updateChar = () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.onCharLoading();
    this.marvelService
      .getCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  render() {
    // taking char, loading, error from state
    const { char, loading, error } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    // if not error or loading, show View comp, else - null
    const content = !(error || loading) ? <View char={char} /> : null;

    return (
      <div className="randomchar">
        {errorMessage}
        {spinner}
        {content}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          {/* edited onClick */}
          <button className="button button__main" onClick={this.updateChar}>
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

// took out component View in order to make changing between Spinner and View comp
const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;

  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className="randomchar__img" />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
