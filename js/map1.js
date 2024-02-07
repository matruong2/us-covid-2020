mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 3.8, // starting zoom
        center: [-98, 40], // starting center
        projection: 'albers'
    }
);
async function geojsonFetch() {
    let response = await fetch('assets/us-covid-2020-rates.geojson');
    let stateData = await response.json();

    map.on('load', function loadingData() {
        map.addSource('stateData', {
            type: 'geojson',
            data: stateData
        });

        map.addLayer({
            'id': 'stateData-layer',
            'type': 'fill',
            'source': 'stateData',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#FFEDA0',   // stop_output_0
                    15,          // stop_input_0
                    '#FED976',   // stop_output_1
                    30,          // stop_input_1
                    '#FEB24C',   // stop_output_2
                    45,          // stop_input_2
                    '#FD8D3C',   // stop_output_3
                    60,         // stop_input_3
                    '#FC4E2A',   // stop_output_4
                    75,         // stop_input_4
                    '#E31A1C',   // stop_output_5
                    90,         // stop_input_5
                    '#BD0026',   // stop_output_6
                    100,        // stop_input_6
                    "#800026"    // stop_output_7
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7
            }
        });
    });

    const layers = [
        '0-14',
        '15-29',
        '30-44',
        '45-59',
        '60-74',
        '75-89',
        '90-99',
        '100 and more'
    ];
    const colors = [
        '#FFEDA070',
        '#FED97670',
        '#FEB24C70',
        '#FD8D3C70',
        '#FC4E2A70',
        '#E31A1C70',
        '#BD002670',
        '#80002670'
    ];
    // create legend
    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Covid Rates<br>(cases/1,000 residents)</b><br><br>";

    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });
    const source = '<p style="text-align: right; font-size:10pt">Sources: <a href="https://data.census.gov/cedsci/table?g=0100000US.050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true">2018 ACS 5 year est</a>, ' +
                    '<a href="https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html"> U.S. Census Bureau</a></p>';
    legend.innerHTML = legend.innerHTML + source;

    //hover mouse to show rates
    map.on('mousemove', ({point}) => {
        const state = map.queryRenderedFeatures(point, {
            layers: ['stateData-layer']
        });
        document.getElementById('text-description').innerHTML = state.length ?
            `<h3>${state[0].properties.county}, ${state[0].properties.state}</h3><p><strong><em>${state[0].properties.rates}</strong> cases of covid per 1,000 residents</em></p>` :
            `<p>Hover over a county!</p>`;
    });
}

geojsonFetch();