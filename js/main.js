const findLocation = document.querySelector("#findLocation");
const todayName = document.querySelector("#todayName");
const locationCity = document.querySelector("#location");
const todayDate = document.querySelector("#todayDate");
const todayTemp = document.querySelector("#todayTemp");
const todayIcon = document.querySelector("#todayIcon");
const todayCondition = document.querySelector("#todayCondition");
const links = document.querySelectorAll(".nav-link");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const windDir = document.querySelector("#wind-dir");

findLocation.addEventListener("input", function (e) {
  let city = e.target.value;
  getWeatherData(city);
});

////////////////////function to get the weather data//////////////////////////////

async function getWeatherData(city) {
    if (city.length <= 2) return;
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?q=${city}&days=3&key=6a875351385e424d8f5160644250405`
      );
      const data = await res.json();
      if (data.error) {
        locationCity .innerHTML = "<h1>City not found</h1>";
        return;
    }
      displayWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
}

getWeatherData("cairo");

/////////////////////function to display the weather data//////////////////////////////

function displayWeatherData(data) {
  ///////////////////////////////////////////toDay///////////////////////////////////////

  let toDayDate = new Date(data.current.last_updated);
  todayName.innerHTML = toDayDate.toLocaleDateString("en-US", {
    weekday: "long",
  });
  todayDate.innerHTML =
    toDayDate.getDate() +
    " " +
    toDayDate.toLocaleString("en-US", { month: "long" });
  locationCity.innerHTML = data.location.name;
  todayTemp.innerHTML = data.current.temp_c + "<sup>o</sup>C";
  todayCondition.innerHTML = data.current.condition.text;
  todayIcon.src = "https:" + data.current.condition.icon;
  humidity.innerHTML = data.current.humidity + "%";
  windSpeed.innerHTML = data.current.wind_kph + "km/h";
  windDir.innerHTML = data.current.wind_dir;

  ///////////////////////////////////////NextDays////////////////////////////////////////
  let cardsContainer = document.querySelector(".card-days");
  let output = ``;

  for (let i = 1; i < data.forecast.forecastday.length; i++) {
    let forecastDay = data.forecast.forecastday[i];
    let date = new Date(forecastDay.date);
    let dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    output += `
    <div class="forecast-card p-4 rounded-3 bg-custom-two text-white text-center ">
      <div class="day">${dayName}</div>
      <img src="https:${forecastDay.day.condition.icon}" alt="" >
      <div class="fs-1">${forecastDay.day.maxtemp_c}<sup>o</sup>C</div>
      <div class="fs-1">${forecastDay.day.mintemp_c}<sup>o</sup>C</div>
      <div class="text-primary">${forecastDay.day.condition.text}</div>
    </div>
  `;
  }

  cardsContainer.innerHTML = output;
}

////////////////////////////////add active class on click///////////////////////////////////////

for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function (e) {
    e.preventDefault();
    links.forEach(function (link) {
      link.classList.remove("active");
    });
    links[i].classList.add("active");
  });
}
