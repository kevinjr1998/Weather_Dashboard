var mainWeather = document.getElementById("Weather_Main");
var nameOfCity = document.getElementById("City_Name");
var cityTemp = document.getElementById("City_Temp");
var cityWind = document.getElementById("City_Wind");
var cityHum = document.getElementById("City_Humidity");
var cityUV = document.getElementById("City_UV");
var UVData = document.getElementById("UV_Data");
var weatherIcon = document.getElementById("Weather_Icon");


var APIKey = "3e317835aa99c5522639a26e16f09c5";

function getApi() {
    // fetch request gets a list of all the repos for the node.js organization
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=London,uk&units=metric&appid=3e317835aa99c5522639a26e16f09c51';
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        var weatherDate = moment.unix(data.dt).format("DD/MM/YYYY");
        nameOfCity.textContent = data.name + " " + "(" + weatherDate + ")";

        var weatherIconURL = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        weatherIcon.setAttribute("src", weatherIconURL);


        var cityLon = data.coord.lon;
        var cityLat = data.coord.lat;

        var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ cityLat + "&lon=" +cityLon+ "&units=metric&appid=3e317835aa99c5522639a26e16f09c51"

        fetch(oneCallURL)
            .then(function(oneCallRes){
                return oneCallRes.json();
            })
            .then(function (oneCallData) {
                console.log(oneCallData);
                cityTemp.textContent = "Temperature: " + oneCallData.current.temp + "°C";
                cityWind.textContent = "Wind Speed: " + oneCallData.current.wind_speed + "m/s";
                cityHum.textContent  = "Humidity: " + oneCallData.current.humidity + "%";
                cityUV.textContent = "UV Index:";
                UVData.textContent = oneCallData.current.uvi;


            })

    
        
        
      });
  }

  getApi();