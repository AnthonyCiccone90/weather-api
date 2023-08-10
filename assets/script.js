  var APIKey = "9938a6ec59d51081d2c12e3bec0443af";
  var city = document.getElementById("cityName").value;
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  var searchHistory = [];
  var savedButtons = document.getElementsByClassName("savedButton");

  function getWeather() {
  
    var city = document.getElementById("cityName").value;

    var APIKey = "9938a6ec59d51081d2c12e3bec0443af";
    
    var queryURL =
      "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
    var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;

    fetch(queryURL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("city", data.name);
        displayWeatherData(data);
      })
    
      .catch((error) => {
        console.error("error", error);
      });

    fetch(forecastURL)
      .then((response) => response.json())
      .then((data) => {
        futureForecast(data);
      });
    savedSearchHistory(city);
  }

  function futureForecast(data) {
    var forecastEl = document.getElementById("forecast");
    
    var groupedByDate = {};
    
    data.list.forEach((forecast) => {
      var date = forecast.dt_txt.split(" ")[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(forecast);
    });

    forecastEl.innerHTML = Object.entries(groupedByDate)
      .map(([date, forecasts]) => {
        return `
          <li class="card">
              <h3>
                  Date: ${date}
                  <img src="${weatherEmoji(forecasts[0].weather[0].icon)}" alt="Weather Icon">
                  <p> Weather: ${forecasts[0].weather[0].description}</p>
                  <p>Temperature: ${averageTemp(forecasts)} °F </p>
                  <p>Humidity: ${averageHumidity(forecasts)} % </p>
                  <p>Wind Speed: ${averageWindSpeed(forecasts)} m/s</p>
              </h3>
          </li>
      `;
      })
      .join("");
  }

  function displayWeatherData(data) {
    const currentDate = dayjs().format("dddd, MMMM D, YYYY");
    var weatherDataEl = document.getElementById("weatherData");
    var tempK = data.main.temp;
    var tempF = (((tempK - 273.15) * 9) / 5 + 32).toFixed(2);
    var emoji = weatherEmoji(data.weather[0].icon);

    weatherDataEl.innerHTML = `
      <h2>${data.name}</h2>
      <img src="${emoji}" alt="Weather Icon">
      <p>Date: ${currentDate}</p>
      <p>Weather: ${data.weather[0].description}</p>
      <p>Temperature: ${tempF} °F</p>
      <p>Humidity: ${data.main.humidity}% </p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
  }

  function averageTemp(forecasts) {
    var totalTemp = 0;
    forecasts.forEach((forecast) => {
      totalTemp += forecast.main.temp;
    });
    return (((totalTemp / forecasts.length - 273.15) * 9) / 5 + 32).toFixed(2);
  }

  function averageHumidity(forecasts) {
    var totalHumidity = 0;
    forecasts.forEach((forecast) => {
      totalHumidity += forecast.main.humidity;
    });
    return (totalHumidity / forecasts.length).toFixed(2);
  }

  function averageWindSpeed(forecasts) {
    var totalWindSpeed = 0;
    forecasts.forEach((forecast) => {
      totalWindSpeed += forecast.wind.speed;
    });
    return (totalWindSpeed / forecasts.length).toFixed(2);
  }


  function weatherEmoji(iconCode) {
    return `http://openweathermap.org/img/w/${iconCode}.png`;
  }

  function savedSearchHistory(city,) {
    searchHistory.push(city);
    var searchHistoryEl = document.getElementById("searchHistoryList");
    searchHistoryEl.innerHTML = `
    <ul>
    ${searchHistory.map((city) => `<li><button class="savedButton"><a href="#">${city}</button></li></a>`).join("")}
    </ul>`;
    console.log("${city}");
  }

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("savedLink")) {
      event.preventDefault(); 
      var cityName = event.target.innerText;
      var savedCity = localStorage.getItem("city");
      getWeather(cityName);
    }
  });


