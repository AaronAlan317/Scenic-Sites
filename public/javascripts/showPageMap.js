


mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: site.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl())

const marker = new mapboxgl.Marker()
    .setLngLat(site.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${site.title}</h3>`
            )
    )
    .addTo(map);