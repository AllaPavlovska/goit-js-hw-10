
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

const setElementStyle = (element, styles) => {
  for (const [property, value] of Object.entries(styles)) {
    element.style[property] = value;
  }
};

setElementStyle(refs.breedSelect, {
  width: '200px',
  height: '30px',
  fontSize: '15px',
});

function hideLoader() {
  setElementStyle(refs.loader, { display: 'none' });
  refs.breedSelect.disabled = false;
}

function showLoader() {
  setElementStyle(refs.loader, { display: 'block' });
  refs.breedSelect.disabled = false;
  setElementStyle(refs.catInfo, { display: 'none' });
  setElementStyle(refs.error, { display: 'none' });
}

function showError(message) {
  Notiflix.Notify.Failure(message || 'Oops! Something went wrong. Try reloading the page.');
  hideLoader();
}

(async function () {
  try {
    showLoader();
    const breeds = await fetchBreeds();
    hideLoader();

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      refs.breedSelect.appendChild(option);
    });

    refs.breedSelect.addEventListener('change', async () => {
      showLoader();
      const selectedBreedId = refs.breedSelect.value;

      if (selectedBreedId) {
        try {
          const catData = await fetchCatByBreed(selectedBreedId);

          if (catData && catData.length > 0) {
            const cat = catData[0];
            refs.catInfo.innerHTML = `
              <img src="${cat.url}" alt="${cat.breeds[0].name}">
              <h2>${cat.breeds[0].name}</h2>
              <p><strong>Description:</strong> ${cat.breeds[0].description}</p>
              <p><strong>Temperament:</strong> ${cat.breeds[0].temperament}</p>
            `;
            setElementStyle(refs.catInfo, { width: '800px', display: 'block' });
          } else {
            showError('No cat data found for the selected breed.');
          }

          hideLoader();
        } catch (error) {
          hideLoader();
          showError('Error fetching cat information.');
          console.error(error);
        }
      }
    });
  } catch (error) {
    hideLoader();
    showError('Error fetching breed information.');
    console.error(error);
  }
})();

