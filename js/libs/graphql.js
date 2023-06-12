async function fetchMetroStations(latitude, longitude) {
    const metroQuery = `
        query metros($cursor: String) {
            metroStations(first: 10, after: $cursor) {
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

    displayMetroStations(metroStations);
}

async function fetchStations(query) {
    const url = "https://healthy-fox-82.deno.dev/graphql"; // Cambia la URL al nuevo servidor
    const requestOptions = {
        method: "POST",
        body: JSON.stringify({ query }),
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();

    return data;
}


function displayMetroStations(stations) {
    const sortedStations = stations.sort((a, b) => {
        const aDistance = calculateDistance(a.coordinates.latitude, a.coordinates.longitude);
        const bDistance = calculateDistance(b.coordinates.latitude, b.coordinates.longitude);
        return aDistance - bDistance;
    });

    const metroListElement = document.getElementById('metro-list');

    sortedStations.slice(0, 10).forEach(station => {
        const stationElement = document.createElement('div');
        stationElement.classList.add("col-md-5");
        stationElement.classList.add("card");
        stationElement.classList.add("mb-4");
        stationElement.innerHTML = `<div class="card-body"><h4 class="card-title">${station.name}</h4><p class="card-text">Latitud: ${station.coordinates.latitude}, Longitud: ${station.coordinates.longitude}</p></div>`;
        metroListElement.appendChild(stationElement);
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