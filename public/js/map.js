
    var map = L.map('map').setView([28.704, 77.102], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

 /*
 mapbox 
 
 mapboxgl.accessToken = mapToken;
 
 const map = new mapboxgl.Map(
 {
 container: "map",
 style: "mapbox://styles/mapbox/street-v12",
 center : listing.geometry.coordinates,
 zoom: 9,
});

console.log(coordinates);

const marker = new mapboxgl.Marker({color: 'red'})
.setLngLat(listing.geometry.coordinates)
.setPopup( new mapboxgl.Popup({offset:25})
.setHTML("<h4>listing.title <p>Exact location will be given  after booking</P> </h4>"))
.addTo(map);
 */ 