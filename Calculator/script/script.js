const DATA = {
  whichSite: ["landing", "multiPage", "onlineStore"],
  price: [4000, 8000, 26000],
  desktopTemplates: [50, 40, 30],
  adapt: 20,
  mobileTemplates: 15,
  editable: 10,
  metrikaYandex: [500, 1000, 2000],
  analyticsGoogle: [850, 1350, 3000],
  sendOrder: 500,
  deadlineDay: [
    [2, 7],
    [3, 10],
    [7, 14]
  ],
  deadlinePercent: [20, 17, 15]
};

const DAY_STRING = ["день", "дня", "дней"];

const startButton = document.querySelector(".start-button");
const firstScreen = document.querySelector(".first-screen");
const mainForm = document.querySelector(".main-form");
const formCalculate = document.querySelector(".form-calculate");
const endButton = document.querySelector(".end-button");
const totalElem = document.querySelector(".total");
const fastRange = document.querySelector(".fast-range");
const totalPriceSum = document.querySelector(".total_price__sum");
const adaptElem = document.getElementById("adapt");
const mobileTemplatesElem = document.getElementById("mobileTemplates");
const typeSite = document.querySelector(".type-site");
const maxDeadline = document.querySelector(".max-deadline");
const rangeDeadline = document.querySelector(".range-deadline");
const deadlineValue = document.querySelector(".deadline-value");
const calcDescription = document.querySelector(".calc-description");

const toggleMobileTemplates = () => {
  if (adaptElem.checked) {
    mobileTemplatesElem.disabled = false;
  } else {
    mobileTemplatesElem.disabled = true;
    mobileTemplatesElem.checked = false;
  }
};
toggleMobileTemplates();

const toggleCheckBoxLabels = target => {
  const checkboxLabel = document.querySelector(`.${target.value}_value`)
    ? document.querySelector(`.${target.value}_value`)
    : "";
  if (target.checked && checkboxLabel) {
    checkboxLabel.textContent = "Да";
  } else {
    checkboxLabel.textContent = "Нет";
  }

  if (!mobileTemplatesElem.checked) {
    document.querySelector(".mobileTemplates_value").textContent = "Нет";
  }
};

function declOfNum(n, titles, from) {
  return (
    n +
    " " +
    titles[
      from
        ? n % 10 === 1 && n % 100 !== 11
          ? 1
          : 2
        : n % 10 === 1 && n % 100 !== 11
        ? 0
        : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
        ? 1
        : 2
    ]
  );
}

const showElement = element => {
  element.style.display = "block";
};

const hideElement = element => {
  element.style.display = "none";
};

const renderTextContent = (total, site, maxDay, minDay) => {
  totalPriceSum.textContent = total;
  typeSite.textContent = site;
  maxDeadline.textContent = declOfNum(maxDay, DAY_STRING, true);
  rangeDeadline.min = minDay;
  rangeDeadline.max = maxDay;
  deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

  calcDescription.textContent = `
  Сделаем ${site} ${
    adapt.checked ? ", адаптированный под мобильные устройства и планшеты" : ""
  } 
  . 
  Установим панель админстратора, 
  чтобы вы могли самостоятельно менять содержание на сайте без разработчика. 
  Подключим Яндекс Метрику, Гугл Аналитику и отправку заявок на почту.
  `;
};

const priceCalculation = elem => {
  let result = 0;
  let index = 0;
  let options = [];
  let site = "";
  let maxDeadLineDay = DATA.deadlineDay[index][1];
  let minDeadLineDay = DATA.deadlineDay[index][0];
  let overPercent = 0;

  toggleMobileTemplates(elem);

  if (elem.name === "whichSite") {
    for (const item of formCalculate.elements) {
      if (item.type === "checkbox") {
        item.checked = false;
      }
    }
    hideElement(fastRange);
  }

  for (const item of formCalculate.elements) {
    if (item.name === "whichSite" && item.checked) {
      index = DATA.whichSite.indexOf(item.value);
      site = item.dataset.site;
      maxDeadLineDay = DATA.deadlineDay[index][1];
      minDeadLineDay = DATA.deadlineDay[index][0];
    } else if (item.classList.contains("calc-handler") && item.checked) {
      options.push(item.value);
    } else if (item.classList.contains("want-faster") && item.checked) {
      const overDay = maxDeadLineDay - rangeDeadline.value;
      overPercent = overDay * (DATA.deadlinePercent[index] / 100);
    }
  }

  result += DATA.price[index];

  options.forEach(key => {
    if (typeof DATA[key] === "number") {
      if (key === "sendOrder") {
        result += DATA[key];
      } else {
        result += DATA.price[index] * (DATA[key] / 100);
      }
    } else {
      if (key === "desktopTemplates") {
        result += DATA.price[index] * (DATA[key][index] / 100);
      } else {
        result += DATA[key][index];
      }
    }
  });
  result += result * overPercent;
  renderTextContent(result, site, maxDeadLineDay, minDeadLineDay);
};

const callBackFormHandler = event => {
  const target = event.target;

  if (target.classList.contains("want-faster")) {
    target.checked ? showElement(fastRange) : hideElement(fastRange);
    priceCalculation(target);
  }
  if (target.classList.contains("calc-handler")) {
    priceCalculation(target);
    toggleCheckBoxLabels(target);
  }
};

startButton.addEventListener("click", () => {
  showElement(mainForm);
  hideElement(firstScreen);
});

endButton.addEventListener("click", () => {
  for (const elem of formCalculate.elements) {
    if (elem.tagName === "FIELDSET") {
      hideElement(elem);
    }
  }

  showElement(totalElem);
});

formCalculate.addEventListener("change", callBackFormHandler);
