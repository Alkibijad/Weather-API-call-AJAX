// 7 days https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// city http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

let apiKey = "92fe8ed71d6c96ecf7fa577cadb248f5";
let inputCity = document.querySelector('[name="city"]');
let searchBtn = document.querySelector('[name="search"]');
let homeCityBtn = document.querySelector('[name="homeCity"]');
let currentDiv = document.querySelector(".current");
let dailyDiv = document.querySelector(".daily");
let cityInfo = {};

window.addEventListener("load", () => {
  if (localStorage.getItem("homeCity")) {
    cityInfo = JSON.parse(localStorage.getItem("homeCity"));
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityInfo.lat}&lon=${cityInfo.lon}&appid=${apiKey}&units=metric`;
    sendRequest(url, displayWeatherData);
  }
});

searchBtn.addEventListener("click", getCoordinate);
homeCityBtn.addEventListener("click", () => {
  localStorage.setItem("homeCity", JSON.stringify(cityInfo));
});

function getCoordinate() {
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${inputCity.value}&appid=${apiKey}`;
  sendRequest(url, getWeatherData);

  // let xml = new XMLHttpRequest();
  // xml.open("get", url);
  // xml.onreadystatechange = function () {
  //   if (xml.readyState === 4 && xml.status === 200) {
  //     getWeatherData(JSON.parse(xml.responseText));
  //   }
  // };
  // xml.send();
}

function getWeatherData(cityData) {
  cityInfo = {
    country: cityData[0].country,
    lat: cityData[0].lat,
    lon: cityData[0].lon,
    name: cityData[0].name,
  };

  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityInfo.lat}&lon=${cityInfo.lon}&appid=${apiKey}&units=metric`;
  sendRequest(url, displayWeatherData);
  // let xml = new XMLHttpRequest();
  // xml.open("get", url);
  // xml.onreadystatechange = function () {
  //   if (xml.readyState === 4 && xml.status === 200) {
  //     displayWeatherData(JSON.parse(xml.responseText));
  //   }
  // };
  // xml.send();
}

function displayWeatherData(weatherData) {
  let current = weatherData.current;
  let daily = weatherData.daily;
  let currentIcon = current.weather[0].icon;
  let text = ``;
  text += `<img src="http://openweathermap.org/img/wn/${currentIcon}@2x.png" alt="">`;
  text += `<h1>City name: ${cityInfo.name}, ${cityInfo.country}</h1>`;
  text += `<h3>Day name: ${dayName(current.dt)}</h3>`;
  text += `<h3>Temperature: ${Math.floor(current.temp)}&deg;C</h3>`;
  currentDiv.innerHTML = text.trim();

  text = "";
  daily.forEach((day) => {
    let dayIcon = day.weather[0].icon;
    text += `<div class="col-3">`;
    text += `<p>${dayName(day.dt)}</p>`;
    text += `<img src="http://openweathermap.org/img/wn/${dayIcon}@2x.png" alt="">`;
    text += `<p>Min: ${Math.floor(day.temp.min)}&deg;C / Max:${Math.floor(
      day.temp.max
    )}&deg;C</p>`;
    text += "</div>";
  });

  dailyDiv.innerHTML = text.trim();
}

function sendRequest(url, callbackfunction) {
  let xml = new XMLHttpRequest();
  xml.open("get", url);
  xml.onreadystatechange = function () {
    if (xml.readyState === 4 && xml.status === 200) {
      callbackfunction(JSON.parse(xml.responseText));
    }
  };
  xml.send();
}

function dayName(unixTimestamp) {
  let date = new Date(unixTimestamp * 1000);
  let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sut"];
  return dayNames[date.getDay()];
}
