class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=600f6b5fb25b9411429020ff28ca7ec8';

  // making request
  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  // getting data for all characters
  getAllCharacters = async () => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`
    );
    return res.data.results.map(this._transformCharacter);
  };

  // getting transformed data for one character
  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]);
  };

  // lodash say warning changes in this function will affect lot of stuff
  // transforming data from server
  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      // if char descr exists put 220 symbols, then '...' else put
      // 'there is no description'
      description: char.description
        ? `${char.description.slice(0, 220)}...`
        : 'There is no describtion for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}

export default MarvelService;
