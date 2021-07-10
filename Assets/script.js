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
var searchHistory = document.getElementById("Search_History_Div");

// all divs on webpage that we want to interact with are callled above


//reads in the search history from local storage
var searchHistoryLocal = JSON.parse(localStorage.getItem("City_Name_History"));

//declares an empty array that will hold the city name history 
var cityNameHistory = [];

//if the search history local storage item is empty (no search history) it will not run the code below
// this if statement will append the content of the searchHistryLocal to the cityNameHistory array if there is any
if (searchHistoryLocal !== null){

    for (var i = 0; i < searchHistoryLocal.length; i++){
        cityNameHistory.push(searchHistoryLocal[i]);
    }
}

cityNameString = JSON.stringify(cityNameHistory); 
localStorage.setItem("City_Name_History", cityNameString); // this will convert the populater array to a string and save it in local storage


// creates the search history buttons and appends them to the search history div
for (var i = 0; i < cityNameHistory.length; i++){
var cityHistory = document.createElement("button");
cityHistory.setAttribute("class", "Search_Hist_City");
cityHistory.textContent = cityNameHistory[i];
searchHistory.appendChild(cityHistory);
        
    }

var APIKey = "3e317835aa99c5522639a26e16f09c51"; //API Key

//the function below is the main block of code that will update the city data to the webpage
function getCityWeather(cityName) {

    mainWeather.style.visibility = "hidden"; //hides the main weather div upon running function
    futureContainer.innerHTML = ''; // cleares the future weather div

    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APIKey}`; //template literal to add APIkey and city name

    //the first fetch makes a call to the requested url, which is the open weather map data API
    fetch(requestUrl)
      .then(function (response) {
        return response.json(); //converts response to object
      })
      .then(function (data) {

        var cityLon = data.coord.lon;
        var cityLat = data.coord.lat; //reads in the co-ordinates of the city.

        var oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=metric&appid=${APIKey}`; //city coordinates are passed to the onecall api url

        fetch(oneCallURL) //makes a call on the url above
            .then(function(oneCallRes){
                return oneCallRes.json();
            })
            .then(function (oneCallData) {


                var currentForecast = oneCallData.current; //sets current object of API to local variable

                var weatherDate = moment.unix(currentForecast.dt).format("DD/MM/YYYY"); //converts the unix timestamp to the date
                nameOfCity.textContent = `${data.name} (${weatherDate})`; //updates text content of nameOfCity with date and city name

                var weatherIconURL = `https://openweathermap.org/img/w/${currentForecast.weather[0].icon}.png`; //sets the url of the weather icon dependant of the icon id given by API
                weatherIcon.setAttribute("src", weatherIconURL); //sets the attribute of the img dlement with the image

                //updates the text content of the mainweather hildren with respective data from onecall API
                cityTemp.textContent = `Temperature: ${currentForecast.temp}°C`;
                cityWind.textContent = `Wind Speed: ${currentForecast.wind_speed} m/s`;
                cityHum.textContent  = `Humidity: ${currentForecast.humidity}%`;
                cityUV.textContent = "UV Index: "; 

                var UVData = document.createElement("div");
                var UVIndex = currentForecast.uvi;
                UVData.textContent = UVIndex;

                //updates the background of the UV index div dependent on the vaue of the UV index
                if( UVIndex >= 0 && UVIndex <= 2 ){
                    UVData.setAttribute("class", "d-inline favourable");
                }else if(UVIndex>2 && UVIndex <= 6){
                        UVData.setAttribute("class", "d-inline moderate"); 
                    } else if(UVIndex > 6){
                        UVData.setAttribute("class", "d-inline severe"); 
                    }

                UVData.setAttribute("id", "UV_Data");    
                cityUV.appendChild(UVData);

                mainWeather.style.visibility = "visible"; //makes the mainWeather div visible

                //the code below creates, amends and append sthe five day forecast title for the future weater div.
                var fiveDayForecast = document.createElement("div");
                fiveDayForecast.setAttribute("class","col-9 d-block pl-0 Five_Day");
                fiveDayForecast.textContent = "Five Day Forecast:" 
                futureContainer.appendChild(fiveDayForecast)

                // the code below loops through the future forecast array containing future weather forecasts and updates the futureWeather div with cards containing data in the future
                for(var i = 1; i < 6; i++){ //skips first entry as that is the forecast for current day, not future

                    var future1 = document.createElement("div"); //creates a new card
                    var future1Weather = oneCallData.daily[i]; // sets the forecast weather for a specific day as 
                    
                    //creates multuple line break objects for spacing
                    var [lb1, lb2, lb3, lb4, lb5] = [document.createElement("br"), document.createElement("br"), document.createElement("br"), document.createElement("br"), document.createElement("br")];

                    //creates a div to hold the date of forecasts and appends to card
                    var future1date = document.createElement("div");
                    future1date.setAttribute("class", "Future_Date");
                    futureDate = moment.unix(future1Weather.dt).format("DD/MM/YYYY");
                    future1date.textContent = futureDate;
                    future1.appendChild(future1date);

                    future1.appendChild(lb1); //appends line break

                    //creates an img element and updates the src as the weather icon URL, before appending to card
                    var future1IconCont = document.createElement("img");
                    future1IconCont.setAttribute("class", "Future_Icon");
                    var futureIcon = `https://openweathermap.org/img/w/${future1Weather.weather[0].icon}.png`;
                    future1IconCont.setAttribute("src", futureIcon);
                    future1.appendChild(future1IconCont);

                    future1.appendChild(lb2);

                    //creates div to hold forecast tenperature, updates then appends to card
                    var future1Temp = document.createElement("div");
                    future1Temp.setAttribute("class", "Future_Temp ");
                    future1Temp.textContent = `Temperature: ${future1Weather.temp.day}°C`;
                    future1.appendChild(future1Temp);

                    future1.appendChild(lb3);

                    //creates div to hold wind speed, updates content, then appends to card
                    var future1wind = document.createElement("div");
                    future1wind.setAttribute("class", "Future_Wind");
                    future1wind.textContent = `Wind Speed: ${future1Weather.wind_speed} m/s`
                    future1.appendChild(future1wind);

                    future1.appendChild(lb4);
                    
                    //crates element to hold humidity, updates content then appends to card
                    var future1Hum = document.createElement("div");
                    future1Hum.setAttribute("class", "Future_Hum ");
                    future1Hum.textContent = `Humidity: ${future1Weather.humidity}%`;
                    future1.appendChild(future1Hum);

                    future1.appendChild(lb5);

                    //sets sets class as bootstrap formatting classes and then appends to the future weatehr div
                    future1.setAttribute("class", "d-inline-flex flex-column border rounded futureDiv");
                    futureContainer.appendChild(future1);
                }
            }) 
        });
    }

// the function below reads the input city name and appends the result to the search history array, which then is used to crate a search history button 
 function citySearch(event) {
    event.preventDefault(); //prevends the default action of the 'submit' event

    //if no city has been entered, will throw alert ot enter name and ends function
    if(cityFormInput.val() == ""){
        alert("Please Enter a City Name!");
        return;
    }

    var cityNameSearched = cityFormInput.val(); // reads in entered value of search bar
    cityNameSearched.trim(); //trims leading and trailing whitespace from string

    getCityWeather(cityNameSearched); //runs function to get weather passing the city name

    cityNameHistory.unshift(cityNameSearched); //appends searched city to cityNameHistory element

    cityFormInput.val(""); //cleares the input after runing get city weather

    searchHistory.innerHTML = ""; //clears the searchHistory element
                    
    //the code below creates buttons and updates the search history element with buttons of the previously searches cities
     for(var i = 0; i < cityNameHistory.length; i++){
        var city = document.createElement("button");
        city.setAttribute("class", "Search_Hist_City");
        city.textContent = cityNameHistory[i];
        searchHistory.appendChild(city);
    }

    localStorage.setItem('City_Name_History' ,JSON.stringify(cityNameHistory)); //converts the city history array to a string and saves it to local storage

 }
cityForm.on("submit", citySearch); //submit listener for search bar


 //adds an event listener on the search history element that will run the getCityWeather function whenever you click on a button
$(searchHistory).on("click", "button", function(event){
    var buttonVal = $(event.target).text(); //gets the text content of the button
    getCityWeather(buttonVal);              //which then is passed to the get city weather function and runs function
})



