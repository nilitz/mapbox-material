import React, { useRef, useEffect, useState} from 'react';

// @ts-ignore
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
// @ts-ignore
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '../../styles/map.css'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
import {Divider} from "@material-ui/core";
// @ts-ignore
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaHVnby1kZWdyb3NzaSIsImEiOiJja3F6N2xqZTIwaHpzMnFzNmp6cDF5aHV1In0.Y5ioTfjqqnpyOk5uSoZigQ';





function MapboxComponent() {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const nav = useRef(null);
    const directions = useRef(null);
    const [zoom, setZoom] = useState(12);
    const [lat, setLat] = useState(45);
    const [lng, setLng] = useState(3);


    useEffect(() => {
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v11\n',
            center: [lng, lat],
            zoom: zoom
        })

        // @ts-ignore
        map.current.on('load', function () {

            nav.current = new mapboxgl.NavigationControl();

            directions.current = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: 'metric',
                profile: 'mapbox/cycling'
            });


            // @ts-ignore
            map.current.addControl(directions.current, 'top-left')

            // Add the control to the map.
            // @ts-ignore
            map.current.addControl(
                new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    zoom: 14,
                    placeholder: 'Enter search',
                    marker: false, // Do not use the default marker style
                    mapboxgl: mapboxgl
                })
            );


            // @ts-ignore
            map.current.addControl(nav.current)

            // Add geolocate control to the map.
            // @ts-ignore
            map.current.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                })
            );


            // Insert the layer beneath any symbol layer.
            // @ts-ignore
            var layers = map.current.getStyle().layers;
            var labelLayerId;
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                    labelLayerId = layers[i].id;
                    break;
                }
            }

            // The 'building' layer in the Mapbox Streets
            // vector tileset contains building height data
            // from OpenStreetMap.
            // @ts-ignore
            map.current.addLayer(
                {
                    'id': 'add-3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'paint': {
                        'fill-extrusion-color': '#aaa',

                        // Use an 'interpolate' expression to
                        // add a smooth transition effect to
                        // the buildings as the user zooms in.
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                },

                labelLayerId
            );


            // @ts-ignore
            map.current.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
            });
            // add the DEM source as a terrain layer with exaggerated height
            // @ts-ignore
            map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

            // add a sky layer that will show when the map is highly pitched
            // @ts-ignore
            map.current.addLayer({
                'id': 'sky',
                'type': 'sky',
                'paint': {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 0.0],
                    'sky-atmosphere-sun-intensity': 15
                }
            });

        })






    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize

        navigator.geolocation.getCurrentPosition((position) => {
            setLng(position.coords.longitude)
            setLat(position.coords.latitude)
            // @ts-ignore
            map.current.setCenter([position.coords.longitude, position.coords.latitude])
        }, () => {}, {enableHighAccuracy: true})



        // @ts-ignore
        map.current.on('move', () => {
            // @ts-ignore
            setLng(map.current.getCenter().lng.toFixed(4));
            // @ts-ignore
            setLat(map.current.getCenter().lat.toFixed(4));
            // @ts-ignore
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
        <div className="map-container">
            <div className="sidebar">
                <span>LONG: {lng}</span>
                <Divider />

                <span>LATI: {lat}</span>

                <Divider />
                <span>ZOOM: {zoom}</span>

                <Divider />
            </div>
            <div className={"container"}>
                <div ref={mapContainer} className="map" />
            </div>
        </div>
    );
}

export default MapboxComponent;
