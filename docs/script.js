//Set the global variables from the localSotrage
let historyButtons = JSON.parse(localStorage.getItem("historyButtons"))
if(historyButtons === null){
  historyButtons = []
}

let currentCity = localStorage.getItem("currentCity")
console.log(currentCity)
if(currentCity === null){
  currentCity = "New York City,US"
}

// Add 5-Day Forecasts
for(let i = 0; i < 5; i++){
  document.querySelector(".forecasts").innerHTML += `
  <div class="forecast">
    <h3>MM/DD/YYYY</h3>
    <img class="weather-icon" alt="weather icon"></img>
    <p>Temp: <span>00.00</span>&deg;F</p>
    <p>Wind: <span>0.00</span> MPH</p>
    <p>Humidity: <span>00</span>%</p>
  </div>
  `
}

//Sets the weather icon, temp, wind, and humidity of a weather element(current weather or one of the 5-day forecasts.
function setWeather(weatherElement, weatherIcon, temp, wind, humidity){
  weatherElement.children[1].setAttribute("src", `http://openweathermap.org/img/w/${weatherIcon}.png`)
  weatherElement.children[2].children[0].textContent = temp
  weatherElement.children[3].children[0].textContent = wind
  weatherElement.children[4].children[0].textContent = humidity
}

function setCurrentWeather(city, apiKey){
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
  .then(response => response.json())
  .then(data => {
    let currentWeatherElement = document.querySelector(".current-weather")
    let dateInfo = new Date() //Used to get the current date
    let date = `(${dateInfo.getMonth() + 1}/${dateInfo.getDate()}/${dateInfo.getFullYear()})`
    let weatherIcon = data.weather[0].icon
    let temp = data.main.temp
    let wind = data.wind.speed
    let humidity = data.main.humidity
    //Set city name and date
    currentWeatherElement.children[0].textContent = `${city} ${date}`
    //Set the weather info
    setWeather(currentWeatherElement, weatherIcon, temp, wind, humidity)
  })
  .catch(error => 
    console.log("Error" + error)
  )
}

function setForecastWeathers(city, apiKey){
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
  .then(response => response.json())
  .then(forecasts => {
    for(let i = 4; i < 40; i += 8){
      let data = forecasts.list[i]
      let forecastElement = document.querySelectorAll(".forecast")[(i-4)/8]
      let dateInfo = new Date(data.dt_txt)//Used to change the format of the date gotten from the api
      let date = `${dateInfo.getMonth() + 1}/${dateInfo.getDate()}/${dateInfo.getFullYear()}`
      let weatherIcon = data.weather[0].icon
      let temp = data.main.temp
      let wind = data.wind.speed
      let humidity = data.main.humidity
      //Set date of forecast
      forecastElement.children[0].textContent = `${date}`
      //Set the weather info
      setWeather(forecastElement, weatherIcon, temp, wind, humidity)
    }
  })
  .catch(error => 
    console.log("Error" + error)
  )
}

function setCity(city){
  let apiKey = "d062b0bdde256bf7053f1ccf371fc717";
  setCurrentWeather(city, apiKey)
  setForecastWeathers(city, apiKey)
  localStorage.setItem("currentCity", `${city}`)
}

function displayHistoryButtons(){
  //Removes any history buttons and then re-adds them all from the global var historyButtons
  document.querySelector(".search-history").innerHTML = ""
  for(let i = 0; i < historyButtons.length; i++){
    document.querySelector(".search-history").innerHTML += `<button class="history-button">${historyButtons[i]}</button>`
  }
  //Adds event listener to newly created history buttons
  document.querySelector(".search-history").addEventListener("click", function(event){
    if(event.target.className !== "history-button"){
      return
    }
    setCity(event.target.textContent)
  })
}

function addHistoryButton(city){
  //Keeps the historyButtons to 10
  historyButtons.push(city)
  if(historyButtons.length > 10){
    historyButtons.shift()
  }
  localStorage.setItem("historyButtons", `${JSON.stringify(historyButtons)}`)
  displayHistoryButtons()
}

// When search button is clicked
document.querySelector(`aside form`).addEventListener("submit", function(event){
  event.preventDefault()
  let searchedCity = document.querySelector('aside input[type="text"]').value
  if(searchedCity === ""){
    console.log("Need to input city")
    return
  }
  addHistoryButton(searchedCity)
  document.querySelector('aside input[type="text"]').value = ""
  setCity(searchedCity)
})

// At startup the code shows the history buttons and sets the city that was previously set
displayHistoryButtons()
setCity(currentCity)

// When clear history button is clicked
document.querySelector(".clear-history").addEventListener("click", function(){
  historyButtons = []
  localStorage.removeItem("historyButtons")
  displayHistoryButtons()
})
