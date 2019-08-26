//----------------------
// Access Key
//----------------------
mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0dXMiLCJhIjoiY2p6YzRkeWtwMDIyZTNtcWJ2YjZoMnF5cSJ9.GWRSZJfHjwofknVHtb917w';

if (!mapboxgl.supported()) {
    alert('Your browser does not support Mapbox GL.');
}

//----------------------
// Menu Part
//----------------------
let map;
let layerList = document.getElementById('menu_panel');
let inputs = layerList.getElementsByTagName('input');
let _style = 'mapbox://styles/mapbox/navigation-preview-night-v2';
let _tmsUrl = 'http://127.0.0.1:8081/geoserver/gwc/service/tms/1.0.0/transport:traffic-4326@EPSG:900913@pbf/{z}/{x}/{y}.pbf';
let _center = [118, 36.5];
let _zoom = 7;
let myDate = new Date();
let _time_text = get_time_text(myDate.getFullYear(), myDate.getMonth()+1, myDate.getDate(), myDate.getHours(), myDate.getMinutes());

loadRouteMap(_tmsUrl);

function switchLayer(layer) {
    let layerId = layer.target.id;
    _style = 'mapbox://styles/mapbox/' + layerId;
    _center = map.getCenter();
    _zoom = map.getZoom();
    map.remove();
    loadRouteMap(_tmsUrl);
}

for (let i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}

//----------------------
//GeoJson Part
//----------------------

//------API Usage------------------------------------------------------
// map.addSource('route', {
//     type: 'geojson',
//     data: './geojson/36_16.geojson'
// });
//
// map.addLayer({
//     "id": "route",             /* layer id是route */
//     "type": "line",            /* line类型layer*/
//     "source": "route",         /* 资源引用的是上面定义的source*/
//     "layout": {
//         "line-join": "round",  /* 线条相交的形状 */
//         "line-cap": "round"    /* 线条末端形状 */
//     },
//     "paint": {
//         "line-color": "#00ffff",  /* 线条颜色 */
//         "line-width": 4        /* 线条宽度 */
//     }
// });
//--------------------------------------------------------------------

function loadRouteMap(_tmsUrl) {
    if (map != null) {
        _center = map.getCenter();
        _zoom = map.getZoom();
        map.remove();
    }

    // mapAddSource
    map = new mapboxgl.Map({
        container: 'map_container',
        // style: 'mapbox://styles/mapbox/navigation-preview-night-v2',
        style: _style,
        center: _center,
        zoom: _zoom
    });

    map.on('load', function () {

        map.addLayer({
            "id": "route" + _time_text,
            'source': {
                'type':'vector',
                'scheme':'tms',
                'tiles':[_tmsUrl]
                //'tiles':['http://192.168.159.129:8080/tiles/output/{z}/{x}/{y}.pbf']
            },
            'source-layer':'traffic-4326',
            "type": "line",
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": {
                    property: 'LOS',
                    type: 'interval',
                    stops: [
                        [1, "#69e965"],
                        [2, "#f7ff79"],
                        [3, "#e97e00"],
                        [4, "#3fe9e4"],
                        [5, "#e95f30"]
                    ]
                },
                "line-width": 4
            }
        });
    });

    cleanIcon();

    // Search
    map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    }), 'top-left');
    // North
    map.addControl(new mapboxgl.NavigationControl({"showCompass": true}), 'top-left');
    // Location
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }), 'top-left');
    // Full Screen
    map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

    // Scale Bar
    map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'imperial'
    }), 'bottom-left');
    // scale.setUnit('metric');

    // Add zoom and rotation controls to the map.
    // map.moveLayer('route');
    // map.rotateTo(180, { duration: 10000 });


    //Ajax
    // $.ajax({
    //     url: './geojson/36_16.geojson',
    //     async: false,
    //     dataType: "json",
    //     success: function (data) {
    //         // alert('Success');
    //
    //         map = new mapboxgl.Map({
    //             container: 'map_container',
    //             // style: 'mapbox://styles/mapbox/navigation-preview-night-v2',
    //             style: _style,
    //             center: _center,
    //             zoom: _zoom
    //         });
    //
    //         map.on('load', function () {
    //             map.addLayer({
    //                 "id": "route",
    //                 "type": "line",
    //                 "source": {
    //                     "type": "geojson",
    //                     "data": data
    //                 },
    //                 "layout": {
    //                     "line-join": "round",
    //                     "line-cap": "round"
    //                 },
    //                 "paint": {
    //                     "line-color": {
    //                         property: 'LOS',
    //                         type: 'interval',
    //                         stops: [
    //                             [1, "#69e965"],
    //                             [2, "#f7ff79"],
    //                             [3, "#e97e00"],
    //                             [4, "#3fe9e4"],
    //                             [5, "#e95f30"]
    //                         ]
    //                     },
    //                     "line-width": 4
    //                 }
    //             });
    //         });
    //
    //         cleanIcon();
    //
    //         // Search
    //         map.addControl(new MapboxGeocoder({
    //             accessToken: mapboxgl.accessToken,
    //             mapboxgl: mapboxgl
    //         }), 'top-left');
    //         // North
    //         map.addControl(new mapboxgl.NavigationControl({"showCompass": true}), 'top-left');
    //         // Location
    //         map.addControl(new mapboxgl.GeolocateControl({
    //             positionOptions: {
    //                 enableHighAccuracy: true
    //             },
    //             trackUserLocation: true
    //         }), 'top-left');
    //         // Full Screen
    //         map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
    //
    //         // Scale Bar
    //         map.addControl(new mapboxgl.ScaleControl({
    //             maxWidth: 80,
    //             unit: 'imperial'
    //         }), 'bottom-left');
    //         // scale.setUnit('metric');
    //
    //         // Add zoom and rotation controls to the map.
    //         // map.moveLayer('route');
    //         map.rotateTo(180, { duration: 10000 });
    //     }
    // });
}

// only change the layer on display to be fast
function changeLayer(layerUrl, time_text) {
    map.removeLayer("route" + _time_text);
    map.removeSource("route" + _time_text);
    _time_text = time_text;
    map.addLayer({
        "id": "route" + time_text,
        'source': {
            'type': 'vector',
            'scheme': 'tms',
            'tiles': [layerUrl]
        },
        'source-layer': 'traffic-4326',
        "type": "line",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": {
                property: 'LOS',
                type: 'interval',
                stops: [
                    [1, "#69e965"],
                    [2, "#f7ff79"],
                    [3, "#e97e00"],
                    [4, "#3fe9e4"],
                    [5, "#e95f30"]
                ]
            },
            "line-width": 4
        }
    });
}

function cleanIcon() {
    // Remove icons on top-left
    let Icons = document.getElementsByClassName('mapboxgl-ctrl-top-left');
    let Icon = Icons.item(0);
    while (Icon.hasChildNodes()) {
        Icon.removeChild(Icon.firstChild);
    }
    // Remove icons on top-right
    Icons = document.getElementsByClassName('mapboxgl-ctrl-top-right');
    Icon = Icons.item(0);
    while (Icon.hasChildNodes()) {
        Icon.removeChild(Icon.firstChild);
    }
    // Remove icons on bottom-left
    Icons = document.getElementsByClassName('mapboxgl-ctrl-bottom-left');
    Icon = Icons.item(0);
    while (Icon.hasChildNodes()) {
        Icon.removeChild(Icon.firstChild);
    }
    // Remove icons on bottom-right
    Icons = document.getElementsByClassName('mapboxgl-ctrl-bottom-right');
    Icon = Icons.item(0);
    while (Icon.hasChildNodes()) {
        Icon.removeChild(Icon.firstChild);
    }
}
