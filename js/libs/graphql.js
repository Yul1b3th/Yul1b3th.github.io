async function fetchMetroStations(latitude, longitude) {
    const metroQuery = `
query metros($cursor: String) {
    metroStations(first: 8, after: $cursor) {
        edges {
            node {
                name
                coordinates {
                    latitude
                    longitude
                }
            }
        }
        pageInfo {
            hasNextPage
            endCursor
        }
    }
}
`;

    const metroResponse = await fetchStations(metroQuery);
    const metroStations = metroResponse.data.metroStations.edges.map(edge => edge.node);

    displayMetroStations(metroStations, latitude, longitude);
}

async function fetchStations(query) {
    const url = new URL("https://barcelona-urban-mobility-graphql-api.netlify.app/graphql");
    const variables = { cursor: null };
    url.searchParams.set("query", query);
    url.searchParams.set("variables", JSON.stringify(variables));

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

function displayMetroStations(stations, latitude, longitude) {
    const sortedStations = stations.sort((a, b) => {
        const aDistance = calculateDistance(latitude, longitude, a.coordinates.latitude, a.coordinates.longitude);
        const bDistance = calculateDistance(latitude, longitude, b.coordinates.latitude, b.coordinates.longitude);
        return aDistance - bDistance;
    });

    const metroListElement = document.getElementById('metro-list');
    const mapElement = document.getElementById('map');

    const map = new google.maps.Map(mapElement, {
        center: { lat: latitude, lng: longitude },
        zoom: 13
    });

    sortedStations.slice(0, 10).forEach(station => {
        const stationElement = document.createElement('div');
        stationElement.classList.add("col-md-5");
        stationElement.classList.add("card");
        stationElement.classList.add("mb-4");
        stationElement.innerHTML = `<div class="card-body"><h4 class="card-title">${station.name}</h4><p class="card-text">Latitud: ${station.coordinates.latitude}, Longitud: ${station.coordinates.longitude}</p></div>`;
        metroListElement.appendChild(stationElement);

        const marker = new google.maps.Marker({
            position: { lat: station.coordinates.latitude, lng: station.coordinates.longitude },
            map: map,
            title: station.name
        });
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchMetroStations(latitude, longitude);
            },
            error => {
                console.error('Error al obtener la ubicación:', error);
            }
        );
    } else {
        console.error('La geolocalización no es compatible con este navegador.');
    }
}

getLocation();