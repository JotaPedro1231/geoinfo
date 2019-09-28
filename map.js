function start() {
    const weather_url = 'https://api.openweathermap.org/data/2.5/weather';
    const weather_key = 'd899fba10b2ca7df48b5620e5f2215f2';
    const map = L.map('map');
    let layers = L.featureGroup();
    startMap();

    function startMap() {
        setMapView([51.505, -0.09], 10);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1Ijoiam90YXBlZHJvMTIzMSIsImEiOiJjazEzaHprYWQwOHQ5M2Jwazc4a3NtbXhlIn0.QDcLO0yu9KW_ZbpuirLRzQ'
        }).addTo(map);
        addHandlersToMap();
    }

    function addHandlersToMap() {
        map.addEventListener('click', evt => {
            let coords = map.mouseEventToLatLng(evt.originalEvent);
            circleArea(coords.lat, coords.lng);
        });
    }

    async function getWeather(lat, lng) {
        let temp = 'Temperatura não encontrada';
        await fetch(weather_url + `?lat=${lat}&lon=${lng}&APPID=${weather_key}&units=metric`)
        .then(resp => resp.json()
        .then(data => {
            temp = data.main.temp;
        }).catch(e => console.warn(e)));
        return temp;
    }

    async function circleArea(lat, lng) {

        let temp = await getWeather(lat, lng);

        if(map.hasLayer(layers)) {
            map.removeLayer(layers);
            layers.clearLayers();
        }

        L.circle([lat, lng], {
            color: 'red',
            fillCorlo: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(layers);

        let marker = L.marker([lat, lng]).bindPopup('Temperatura: ' + temp.toString() + '°C').addTo(layers);

        map.addLayer(layers);

        marker.openPopup();
    }

    function setMapView([lat=0, lng=0], zoom=10) {
        map.setView([lat, lng], zoom)
    }
}

start();