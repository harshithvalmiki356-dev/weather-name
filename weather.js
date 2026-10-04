const city=document.querySelector("#cityInput");
const search=document.querySelector("#searchBtn");
const cityCap=document.querySelector("#cityName");
const tempElement = document.querySelector("#temp");
const weatherElement=document.querySelector("#humidity");
const speedElement=document.querySelector("#windSpeed");
const description=document.querySelector("#description");
const weatherIcon=document.querySelector("#weatherIcon");
const loading=document.querySelector("#loading");
const rainAnimation = document.querySelector("#rainAnimation");
const suggestions = document.querySelector("#suggestions");
city.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !search.disabled) {
        search.click();
    }
});
city.addEventListener("input", () => {
    const cityName = city.value.trim();

    if (cityName.length >= 3) {
        getCitySuggestions(cityName);
    } else {
        suggestions.innerHTML = "";
    }
});
search.addEventListener('click',()=>{
    const cityName=city.value.trim();
    if(cityName===""){
    alert("enter a valid city name!");
    
    }
    else{
        getCoordinates(cityName);
    }
});
async function getCitySuggestions(cityName) {
    
    try{
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=10`;
        const responce=await fetch(url);
        if(!responce.ok){
            throw new Error("failed to reach the cities!");
        }
        const data=await responce.json();
        if (!data.results || data.results.length === 0) {
            suggestions.textContent = "No cities found!";
            return;
        }
       suggestions.innerHTML = "";
        data.results.forEach((cityData) => {
    const cityElement = document.createElement("div");

    cityElement.textContent =
        `${cityData.name}, ${cityData.admin1 || ""}, ${cityData.country}`;

    cityElement.addEventListener("click", async () => {
    city.value = "";
    suggestions.innerHTML = "";

    cityCap.textContent =
    `${cityData.name}, ${cityData.admin1 || ""}, ${cityData.country}`;

    loading.textContent = "Fetching weather...";
    search.disabled = true;
    search.textContent = "Searching...";

    try {
        await getWeather(cityData.latitude, cityData.longitude);
    } finally {
        loading.textContent = "";
        search.disabled = false;
        search.textContent = "Search";
    }
});
     suggestions.appendChild(cityElement);
});
    }
    catch(error){
        console.log(error.message);
        suggestions.textContent = "Unable to load city suggestions!";
    }
}
async function getCoordinates(cityName){
    search.disabled = true;
    search.textContent = "Searching...";
    loading.textContent = "Fetching weather...";
    try{
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
    const responce=await fetch(url);
    if(!responce.ok){
        throw new Error(  "failed to fetch weather!");
    }
      
    const data=await responce.json();
     if (!data.results || data.results.length === 0) {
            throw new Error("City not found!");
        }

        const latitude = data.results[0].latitude;
        const longitude=data.results[0].longitude;
        cityCap.textContent=data.results[0].name;
        await getWeather(latitude,longitude);
    }
    catch(error){
        alert(error.message);
    }
    finally{
        loading.textContent="";
        search.disabled = false;
        search.textContent = "Search";
    }

}
getCoordinates(tirupati);
async function getWeather(latitude,longitude) {
    try{
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
        const responce=await fetch(url);
        if (!responce.ok) {
            throw new Error("Failed to fetch weather!");
        }
        const data=await responce.json();
        const temperature = data.current.temperature_2m;
        const humidity=data.current.relative_humidity_2m;
        const speed=data.current.wind_speed_10m;
        const weatherCode=data.current.weather_code;
        weatherIcon.src = getWeatherIcon(weatherCode);
        weatherIcon.alt = getWeatherDescription(weatherCode);
        tempElement.textContent = `${temperature}°C`;
        weatherElement.textContent=`${humidity}%`;
        speedElement.textContent=`${speed}kmph`;
        description.textContent =
        getWeatherDescription(weatherCode);
        showRainAnimation(weatherCode);
        console.log(data.current.weather_code);

    }
    catch(error){
        alert(error.message);
    }
}
function getWeatherDescription(code){
    if(code===0){
        return "Clear sky!";
    }
    else if(code===1){
        return "mainly clear";
    }
    else if(code===2){
        return "Partly cloudy!";
    }
    else if (code === 3) {
    return "Overcast";
    }
    else if(code===48 || code===45){
        return "Fog";
    }
    else if(code===61 || code===63 || code===65){
        return "Rain";
    }
    else if(code===95){
        return "Thunderstorm";
    }
    else if (code === 51 || code === 53 || code === 55) {
    return "Drizzle";
    }
    else if (code === 80 || code === 81 || code === 82) {
        return "Rain Showers";
    }
    else if (code === 71 || code === 73 || code === 75) {
        return "Snow";
    }
    else if (code === 95 || code === 96 || code === 99) {
    return "Thunderstorm";
    }
    else {
        return "unknown weather!";
    }
}
function getWeatherIcon(code) {

    if (code === 0) {
        return "https://openweathermap.org/img/wn/01d@2x.png";
    }
    else if(code===1){
        return "https://openweathermap.org/img/wn/02d@2x.png";
    }
    else if(code===2){
        return "https://openweathermap.org/img/wn/03d@2x.png";
    }
    else if(code===3){
         return "https://openweathermap.org/img/wn/04d@2x.png";
    }
    else if(code===48 || code===45){
        return "https://openweathermap.org/img/wn/50d@2x.png";
    }
    else if(code===61 || code===63 || code===65){
        return "https://openweathermap.org/img/wn/10d@2x.png";
    }
    else if(code===95){
        return "https://openweathermap.org/img/wn/11d@2x.png";
    }
    else if (code === 51 || code === 53 || code === 55) {
    return "https://openweathermap.org/img/wn/09d@2x.png";
    }
    else if (code === 80 || code === 81 || code === 82) {
        return "https://openweathermap.org/img/wn/09d@2x.png";
    }
    else if (code === 71 || code === 73 || code === 75) {
        return "https://openweathermap.org/img/wn/13d@2x.png";
    }
    else if (code === 95 || code === 96 || code === 99) {
    return "https://openweathermap.org/img/wn/11d@2x.png";
    }
    else {
        return "https://openweathermap.org/img/wn/02d@2x.png";
    }

    
}
function showRainAnimation(code) {
    const rainyCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82,95,96,99];

    if (rainyCodes.includes(code)) {
        rainAnimation.style.display = "flex";
        rainAnimation.innerHTML = `
            <span class="raindrop"></span>
            <span class="raindrop"></span>
            <span class="raindrop"></span>
            <span class="raindrop"></span>
        `;
    } else {
        rainAnimation.style.display = "none";
        rainAnimation.innerHTML = "";
    }
}
showRainAnimation(95);
showRainAnimation(97);
showRainAnimation(65);
weatherIcon.onerror = () => {
    weatherIcon.src = "https://openweathermap.org/img/wn/04d@2x.png";
    weatherIcon.onerror = null;
};


