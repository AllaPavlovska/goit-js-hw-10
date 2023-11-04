import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
const refs = {
  breedSelect: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
  catInfo: document.querySelector('.cat-info'),
};
new SlimSelect('.breed-select');
refs.breedSelect.style.width = '200px';
refs.breedSelect.style.height = '30px';
refs.breedSelect.style.fontSize = '15px';
function hideLoader() {
  refs.loader.style.display = 'none';
  refs.breedSelect.disabled = false;
}
function showloader() {
  refs.loader.style.display = 'block';
  refs.breedSelect.disabled = false;
  refs.catInfo.style.display = 'none';
  refs.error.style.display = 'none';
}

function showError() {
  Notiflix.Notify.Failure('Oops! Something went wrong. Try reloading the page.');
  hideLoader();
}
fetchBreeds()
  .then(breeds => {
    hideLoader();
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      refs.breedSelect.appendChild(option);
    });
  })
  .catch(() => {
    hideLoader();
    showError();
  });
refs.breedSelect.addEventListener('change', () => {
  showloader();
  const selectedBreedId = refs.breedSelect.value;
  if (selectedBreedId) {
    fetchCatByBreed(selectedBreedId)
      .then(catData => {
        hideLoader();
        const cat = catData[0];
        refs.catInfo.innerHTML = `
                 <img src="${cat.url}" alt="${cat.breeds[0].name}">
          <h2>${cat.breeds[0].name}</h2>
          <p><strong>Description:</strong> ${cat.breeds[0].description}</p>
          <p><strong>Temperament:</strong> ${cat.breeds[0].temperament}</p>
                `;
        refs.catInfo.style.width = '800px';
        refs.catInfo.style.display = 'block';
      })
      .catch(() => {
        hideLoader();
        showError();
      });
  }
});