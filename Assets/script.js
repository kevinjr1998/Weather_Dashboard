var mainWeather = document.getElementById("Weather_Main");
var nameOfCity = document.getElementById("City_Name");
var cityTemp = document.getElementById("City_Temp");
var cityWind = document.getElementById("City_Wind");
var cityHum = document.getElementById("City_Humidity");
var cityUV = document.getElementById("City_UV");
var UVData = document.getElementById("UV_Data");
var weatherIcon = document.getElementById("Weather_Icon");
var futureContainer = document.getElementById("Weather_Future");
var cityForm = $("#City_Form");
var cityFormInput = $("#City_Form_Input");



var cityNameHistory = [];


var APIKey = "3e317835aa99c5522639a26e16f09c5";

function getCityWeather(cityName) {
    // fetch request gets a list of all the repos for the node.js organization
    futureContainer.innerHTML = '';

    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&appid=3e317835aa99c5522639a26e16f09c51';
  
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
                cityWind.textContent = "Wind Speed: " + oneCallData.current.wind_speed + " m/s";
                cityHum.textContent  = "Humidity: " + oneCallData.current.humidity + "%";
                cityUV.textContent = "UV Index: ";


                var UVData = document.createElement("div");
                var UVIndex = oneCallData.current.uvi;
                UVData.textContent = UVIndex;
                
                if( UVIndex >= 0 && UVIndex <= 2 ){
                    UVData.setAttribute("class", "d-inline favourable");
                }else if(UVIndex>2 && UVIndex <= 6){
                        UVData.setAttribute("class", "d-inline moderate"); 
                    } else if(UVIndex > 6){
                        UVData.setAttribute("class", "d-inline severe"); 
                    }

                UVData.setAttribute("id", "UV_Data");    
                cityUV.appendChild(UVData);


                for(var i = 1; i < 6; i++){

                

                    var future1 = document.createElement("div");
                    var future1Weather = oneCallData.daily[i];

                    var future1date = document.createElement("div");
                    future1date.setAttribute("class", "Future_Date");
                    futureDate = moment.unix(future1Weather.dt).format("DD/MM/YYYY");
                    future1date.textContent = futureDate;

                    future1.appendChild(future1date);
                

                    var future1Temp = document.createElement("div");
                    future1Temp.setAttribute("class", "Future_Temp ");
                    future1Temp.textContent = "Temp: " + future1Weather.temp.day + "°C";
                    future1.appendChild(future1Temp);


                    var future1IconCont = document.createElement("img");
                    future1IconCont.setAttribute("class", "Future_Icon");
                    var futureIcon = "http://openweathermap.org/img/w/" + future1Weather.weather[0].icon + ".png";
                    future1IconCont.setAttribute("src", futureIcon);
                    future1.appendChild(future1IconCont);


                    var future1Hum = document.createElement("div");
                    future1Hum.setAttribute("class", "Future_Hum ");
                    future1Hum.textContent = "Hum: " + future1Weather.humidity + "%";
                    future1.appendChild(future1Hum);
                
                    future1.setAttribute("class", "d-inline-flex flex-column border rounded futureDiv");

                    futureContainer.appendChild(future1);

                }



            })

    
        
        
      });
  }



 function citySearch(event) {
    event.preventDefault();

    if(cityFormInput.val() == ""){
        alert("Please Enter a City Name!");
        return;
    }

    var cityNameSearched = cityFormInput.val();
    cityNameSearched.trim();

    getCityWeather(cityNameSearched);


    cityNameHistory.push(cityNameSearched);
    localStorage.setItem('City_Name_History' ,JSON.stringify(cityNameHistory));





 }



cityForm.on("submit", citySearch);



// getCityWeather();