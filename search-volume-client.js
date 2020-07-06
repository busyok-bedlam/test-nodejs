class FakeSearchVolumeClient {

  async getSearchVolume(keywords) {
    if(!Array.isArray(keywords) || keywords.length > 100) {
      throw new Error('Not valid keywords parameter. Should be an array of strings with max 100 elems');
    }
    await this._wait(2000);
    
    return keywords.map(x => ({
      keyword: x,
      searchVolume: this._randomIntBetween(0, 100000),
    }))
  }

  async _wait(time) {
    return new Promise((res, rej) => setTimeout(res, time));
  }

  _randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

module.exports = FakeSearchVolumeClient;
