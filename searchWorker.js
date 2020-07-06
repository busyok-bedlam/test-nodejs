const FakeSearchClient = require('./search-volume-client.js');
const keywords = JSON.parse(process.argv[2]);

const getSearchValues = async keywords => {
  try {
    const searchClient = new FakeSearchClient();
    const resultValues = await searchClient.getSearchVolume(keywords);
    for (const {keyword, searchVolume} of resultValues) {
      console.log(`${keyword} = ${searchVolume}`);
    }
  }
  catch(err) {
    throw err;
  }
}

(async () => {
  await getSearchValues(keywords)
})()
