const formSearch = document.querySelector('.form-search');
const fromInput = document.querySelector('.input__cities-from');
const toInput = document.querySelector('.input__cities-to');
const dateInput = document.querySelector('.input__date-depart');
const dropdownFrom = document.querySelector('.dropdown__cities-from');
const dropdownTo = document.querySelector('.dropdown__cities-to');
const findButton = document.querySelector('.button__search-text');

let cities = [];

const citiesApi = 'database/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = 'f3a579e1767486fce804a4c1eaa5e01a';

//Functions
const getData = async (url, callback) => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    callback(json);
  } catch (err) {
    console.log(err);
  }
};

const getTickets = (fromCity, toCity, date) => {
  let fromCode = cities.find(item => item.name === fromCity).code;
  let toCode = cities.find(item => item.name === toCity).code;
  const PRICE_CALENDAR = `http://min-prices.aviasales.ru/calendar_preload?origin=${fromCode}&destination=${toCode}&depart_date=${date}&one_way=true&token=${API_KEY}`;
  getData(PRICE_CALENDAR, data => {
    renderCheap(data, date);
  });
};

const renderCheap = (data, date) => {
  const cheapTicketYear = data.best_prices;
  const cheapTicketDay = cheapTicketYear.filter(
    item => item.depart_date === date
  );

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
};

const renderCheapDay = cheapTicket => {
  console.log(cheapTicket);
};

const renderCheapYear = cheapTickets => {
  console.log(cheapTickets);
};

const showCity = (event, list) => {
  list.textContent = '';
  if (event.target.value === '') return;
  const filterCities = cities.filter(city => {
    const lowCaseCity = city.name.toLowerCase();
    return lowCaseCity.includes(event.target.value.toLowerCase());
  });

  filterCities.forEach(city => {
    const li = document.createElement('li');
    li.classList.add('dropdown__city');
    li.textContent = city.name;
    list.append(li);
    if (event.target.value === city.name) list.textContent = '';
  });
};

const hideListOnClick = (target, list, inputField) => {
  const city = target.textContent;
  if (target.tagName.toLowerCase() === 'li') inputField.value = city;
  list.textContent = '';
};

fromInput.addEventListener('input', event => {
  showCity(event, dropdownFrom);
});

dropdownFrom.addEventListener('click', event => {
  hideListOnClick(event.target, dropdownFrom, fromInput);
});

toInput.addEventListener('input', event => {
  showCity(event, dropdownTo);
});

dropdownTo.addEventListener('click', event => {
  hideListOnClick(event.target, dropdownTo, toInput);
});

//Function callings

getData(citiesApi, data => {
  const dataCities = data;
  cities = dataCities.filter(item => item.name !== null);
});

formSearch.addEventListener('submit', event => {
  event.preventDefault();
  const from = fromInput.value;
  const to = toInput.value;
  const date = dateInput.value;
  getTickets(from, to, date);
});
