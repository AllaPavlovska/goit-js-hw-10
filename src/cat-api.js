import axios from 'axios';
const apiKey =
  'live_liaEOubyKafoRZRbVZ0RaxwQKUMPUd5vSl1pc8LL29CRiMgZPd9t1SeZ0fYgR5Un';
axios.defaults.headers.common['x-api-key'] = apiKey;
export function fetchBreeds() {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}
export function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
} 









