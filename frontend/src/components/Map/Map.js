import React from 'react'
import './Map.css'
import './Uber_Logo_Black.jpg'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken =
  'pk.eyJ1IjoidGlqbWVudiIsImEiOiJjazczYmg2a3MwYWEzM2ttc2F6Y3dhOHUxIn0.qlFJ8e9yzK7DFsVVOBH1hg'

class Map extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      uberLink: ''
    }
  }

  componentDidMount () {
    console.log('Load')
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', //stylesheet location
      center: [4.9535253, 52.354409], // starting position
      zoom: 12 // starting zoom
    })

    // set the bounds of the map
    var bounds = [
      [4.3339212, 51.8545983],
      [5.3339212, 52.8545983]
    ]
    map.setMaxBounds(bounds)

    // initialize the map canvas to interact with later
    var canvas = map.getCanvasContainer()

    // an arbitrary start will always be the same
    // only the end or destination will change
    var start = [4.9535253, 52.354409]
    // Set end coordinates (destination)
    var endcoords = [4.925029, 52.356034]
    // Create Uber link
    function getUberLink (start, end) {
      var uberLink = 
              'https://m.uber.com/?action=setPickup&client_id=ZBaarguqpNi1cIMaFOIikaDNOzcqSAfO&pickup[latitude]='
              + start[1]
              + '&pickup[longitude]='
              + start[0]
              + '&dropoff[latitude]='
              + end[1]
              + '&dropoff[longitude]='
              + end[0]
      console.log('Uber link: ', uberLink)
      return uberLink
    }

    var uberLink = getUberLink(start, endcoords)
    this.setState({uberLink: uberLink});

    // Set Uber link
    var b0 = document.getElementById('order-uber')
    b0.onclick = function () {
      
      console.log('uberlink: ', uberLink)
    }

    // NEW CODE, choose means
    var b1 = document.getElementById('cycling'),
      b2 = document.getElementById('driving'),
      b3 = document.getElementById('walking')
    var means = 'cycling'
    b1.onclick = function () {
      means = 'cycling'
      getRoute(endcoords)
    }
    b2.onclick = function () {
      means = 'driving'
      getRoute(endcoords)
    }
    b3.onclick = function () {
      means = 'walking'
      getRoute(endcoords)
    }

    // END OF NEW CODE
    var that = this;
    // create a function to make a directions request
    function getRoute (end) {
      // make directions request using cycling/driving/walking profile
      var url =
        'https://api.mapbox.com/directions/v5/mapbox/' +
        means +
        '/' +
        start[0] +
        ',' +
        start[1] +
        ';' +
        end[0] +
        ',' +
        end[1] +
        '?steps=true&geometries=geojson&access_token=' +
        mapboxgl.accessToken

      // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
      var req = new XMLHttpRequest()
      req.open('GET', url, true)
      req.onload = function () {
        var json = JSON.parse(req.response)
        var data = json.routes[0]
        var route = data.geometry.coordinates
        var geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }
        // if the route already exists on the map, we'll reset it using setData
        if (map.getSource('route')) {
          map.getSource('route').setData(geojson)
        }
        // otherwise, we'll make a new request
        else {
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: geojson
                }
              }
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
              'line-opacity': 0.75
            }
          })
        }

        // get the sidebar and add the instructions
        var instructions = document.getElementById('menuinstructions')
        var steps = data.legs[0].steps

        var tripInstructions = []
        for (var i = 0; i < steps.length; i++) {
          tripInstructions.push(
            '<li>' + steps[i].maneuver.instruction + '</li>'
          )
          if (instructions) {
            instructions.innerHTML =
              '<br><span class="duration">Trip duration (' +
              means +
              '): ' +
              Math.floor(data.duration / 60) +
              ' min </span>' +
              tripInstructions
          }
        }
      }

      var uberLink = getUberLink(start, endcoords)
      that.setState({uberLink: uberLink});
      req.send()
    }

    map.on('load', function () {
      // make an initial directions request that
      // starts and ends at the same location
      getRoute(start)

      // Add destination to the map
      map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: start
                }
              }
            ]
          }
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#3887be'
        }
      })

      //NEW CODE (copied from on click)
      var end = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: endcoords
            }
          }
        ]
      }
      if (map.getLayer('end')) {
        map.getSource('end').setData(end)
      } else {
        map.addLayer({
          id: 'end',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: endcoords
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#f30'
          }
        })
      }
      getRoute(endcoords)

      // END OF NEW CODE

      // allow the user to click the map to change the destination
      map.on('click', function (e) {
        var coordsObj = e.lngLat
        canvas.style.cursor = ''
        endcoords = Object.keys(coordsObj).map(function (key) {
          return coordsObj[key]
        })
        var end = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: endcoords
              }
            }
          ]
        }
        if (map.getLayer('end')) {
          map.getSource('end').setData(end)
        } else {
          map.addLayer({
            id: 'end',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'Point',
                      coordinates: endcoords
                    }
                  }
                ]
              }
            },
            paint: {
              'circle-radius': 10,
              'circle-color': '#f30'
            }
          })
        }
        getRoute(endcoords)
      })
    })  
  }
  render () {
    return (
      <div id='container'>
        <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.8.0/mapbox-gl.js'></script>
        <link
          href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.8.0/mapbox-gl.css'
          rel='stylesheet'
        />
        <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>
        <div id='menu'>
          <h1>Menu</h1>
          <button id='driving' class='button click' value='driving'>
            Driving
          </button>
          <button id='cycling' class='button click' value='cycling'>
            Cycling
          </button>
          <button id='walking' class='button click' value='Walking'>
            Walking
          </button>
          <form id='uberlinkform' target='_blank' action={this.state.uberLink}>
              <input type='image' src={require('./Uber_Logo_Black.jpg')} id='order-uber' alt="Submit Form" value='Order Uber' width='80%' height='80%' />
          </form>
          <div id='menuinstructions'></div>
        </div>
        <div id='mapbox'>
          <div id='map'></div>
          <div id='instructions'></div>
        </div>
      </div>
    )
  }
}

export default Map
