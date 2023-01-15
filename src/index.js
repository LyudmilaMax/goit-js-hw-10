import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputSearchCountry = document.querySelector('#search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

inputSearchCountry.addEventListener(
  'input',
  debounce(onSearchCountry, DEBOUNCE_DELAY)
);

function onSearchCountry(evt) {
  const inputValue = evt.target.value.trim();
  if (!inputValue) {
    clearAllMarkup();

    return;
  }

  fetchCountries(inputValue)
    .then(response => {
      console.log(response);
      if (response.length == 1) {
        createMarkupOneCountry(response[0]);
      } else if (response.length >= 2 && response.length <= 10) {
        createMarkupCountries(response);
      } else if (response.length > 10) {
        clearAllMarkup();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(err => {
      clearAllMarkup();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupOneCountry({
  name: { official },
  capital,
  population,
  flags: { svg },
  languages,
}) {
  listCountry.innerHTML = '';
  infoCountry.innerHTML = `
  <img class="country-img" src="${svg}" alt="Flag of ${official}" width="100"></img>
    <h2>${official}</h2>
    <h3>Capital: ${capital}</h3>
    <h3>Population: ${population}</h3>
    <h3>Languages: ${Object.values(languages)}</h3>`;
}

function createMarkupCountries(arrayCountries) {
  infoCountry.innerHTML = '';

  listCountry.innerHTML = arrayCountries
    .map(
      ({ flags: { svg }, name: { official } }) =>
        `<li class="country-item"><img class="country-img" src="${svg}" alt="Flag of ${official}" width="100"></img><h2>${official}</h2></li>`
    )
    .join('');
}

function clearAllMarkup() {
  listCountry.innerHTML = '';
  infoCountry.innerHTML = '';
}