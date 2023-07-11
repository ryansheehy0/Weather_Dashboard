// Add 5-Day Forecasts
for(let i = 0; i < 6; i++){
  document.querySelector(".forecasts").innerHTML += `
  <div class="forecast">
    <h4>MM/DD/YYYY</h4>
    <i class="fas fa-sun"></i>
    <p>Temp: <span class="temp">00.00&deg;F</span></p>
    <p>Wind: <span class="wind">0.00 MPH</span></p>
    <p>Humidity: <span class="humidity">00 %</span></p>
  </div>
  `
}
