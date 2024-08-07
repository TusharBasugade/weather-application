const apiKey = "8a921669a1f2b7de530c7e9bda372810";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const currentLocationBtn = document.querySelector(".location button");
const voiceOutputBtn = document.querySelector(".voice-output");


async function checkWeather(city) {
  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    if (response.status === 404) {
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
    } else {
      const data = await response.json();
      updateWeather(data);
    
    }
  } catch (error) {
    console.error(error);
  }
}

async function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(async position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(url);
     
      if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
      } else {
        const data = await response.json();
        updateWeather(data);
      
        
      }
    } catch (error) {
      console.error(error);
      document.querySelector(".error").textContent = 'Error getting current location';
    }
  }, error => {
    console.error(error);
    document.querySelector(".error").textContent = 'Invalid City Name';
  });
}

function updateWeather(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + "Km/Hr";

  switch (data.weather[0].main) {
    case "Clouds":
      weatherIcon.src = "images/clouds.png";
      break;
    case "Clear":
      weatherIcon.src = "images/clear.png";
      break;
    case "Rain":
      weatherIcon.src = "images/rain.png";
      break;
    case "Drizzle":
      weatherIcon.src = "images/drizzle.png";
      break;
    case "Mist":
      weatherIcon.src = "images/mist.png";
      break;
    default:
      console.log("Unknown weather condition");
  }

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}
function readWeather() {
  const city = document.querySelector(".city").textContent;
  const temp = document.querySelector(".temp").textContent;
  const humidity = document.querySelector(".humidity").textContent;
  const wind = document.querySelector(".wind").textContent;

  const weatherText = `The weather in ${city} is currently ${temp} with a humidity of ${humidity} and wind speed of ${wind}.`;

  const speech = new SpeechSynthesisUtterance(weatherText);
  window.speechSynthesis.speak(speech);
}


searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

currentLocationBtn.addEventListener('click', getCurrentLocation);

voiceOutputBtn.addEventListener('click',readWeather);


