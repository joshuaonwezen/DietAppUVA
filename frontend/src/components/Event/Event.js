import React from 'react'
import './Event.css'
import '../../App.css';
import './Uber_Logo_White_Cropped.png'
import mapboxgl from 'mapbox-gl'
import Collapsible from 'react-collapsible';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyCT4fNYm9Wx85KWy-4nd08bw5rg-5gpL6o");
Geocode.setLanguage("en");
Geocode.setRegion("nl");
Geocode.enableDebug();

mapboxgl.accessToken =
  'pk.eyJ1IjoidGlqbWVudiIsImEiOiJjazczYmg2a3MwYWEzM2ttc2F6Y3dhOHUxIn0.qlFJ8e9yzK7DFsVVOBH1hg'

class Event extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      endLat: 4.925029,
      endLng: 52.356034,
      startLat: 4.925029,
      startLng: 52.356034
    }



    this.joinEvent = this.joinEvent.bind(this)
    this.setMap = this.setMap.bind(this)
    this.getCoords = this.getCoords.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  async getCoords() {
    console.log('getcoords')
    var that = this;
    await Geocode.fromAddress(this.props.user[0].address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        that.setState({ startLat: lat, startLng: lng });
        console.log('start');
      },
      error => {
        console.error(error);
      }
    );

    await Geocode.fromAddress(this.props.event.address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        that.setState({ endLat: lat, endLng: lng });
        that.setMap();
        console.log('end');
      },
      error => {
        console.error(error);
      }
    );
  }
  joinEvent = async e => {
    e.preventDefault()
    this.setState({ loading: true })
    var that = this
    var attendees = [];
    if (this.props.event.attendees.indexOf('[') !== -1) {
      attendees = JSON.parse(this.props.event.attendees);
    } else {
      attendees = [this.props.event.attendees];
    }
    attendees.push(this.props.user[0].username)
    try {
      await fetch(`https://dscs.cloudno.de/eventupdate?id=${this.props.event.id}&attendees=${attendees}`, {
        crossDomain: true,
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(response => response.json())
        .then(function (response) {
          var data = response
          console.log(data)
          that.setState({ loading: false })
          that.props.navigate('personalcalendar')

        })
        .catch(err => {
          that.setState({ loading: false })

          console.log(err)
        })
    } catch (err) {
      that.setState({ loading: false })

      console.log(err)
    }

  }

  setMap() {
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', //stylesheet location
      center: [this.state.startLng, this.state.startLat], // starting position
      zoom: 12 // starting zoom
    })

    // set the bounds of the map
    var bounds = [
      // [(this.state.startLng), this.state.startLat],
      // [this.state.endLng, this.state.endLat]
      [3.31497114423, 50.803721015],
      [7.09205325687, 53.5104033474]
    ]
    map.setMaxBounds(bounds)

    // initialize the map canvas to interact with later
    var canvas = map.getCanvasContainer()

    // an arbitrary start will always be the same
    // only the end or destination will change
    var start = [this.state.startLng, this.state.startLat]
    // Set end coordinates (destination)
    var endcoords = [this.state.endLng, this.state.endLat]
    console.log(endcoords)
    // Create Uber link
    function getUberLink(start, end) {
      var uberLink =
        'https://m.uber.com/?action=setPickup&client_id=ZBaarguqpNi1cIMaFOIikaDNOzcqSAfO&pickup[latitude]='
        + start[1]
        + '&pickup[longitude]='
        + start[0]
        + '&dropoff[latitude]='
        + end[1]
        + '&dropoff[longitude]='
        + end[0]
      return uberLink
    }

    var uberLink = getUberLink(start, endcoords)
    this.setState({ uberLink: uberLink });

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
    function getRoute(end) {
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
      that.setState({ uberLink: uberLink });
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

      // // allow the user to click the map to change the destination
      // map.on('click', function (e) {
      //   var coordsObj = e.lngLat
      //   canvas.style.cursor = ''
      //   endcoords = Object.keys(coordsObj).map(function (key) {
      //     return coordsObj[key]
      //   })
      //   var end = {
      //     type: 'FeatureCollection',
      //     features: [
      //       {
      //         type: 'Feature',
      //         properties: {},
      //         geometry: {
      //           type: 'Point',
      //           coordinates: endcoords
      //         }
      //       }
      //     ]
      //   }
      //   if (map.getLayer('end')) {
      //     map.getSource('end').setData(end)
      //   } else {
      //     map.addLayer({
      //       id: 'end',
      //       type: 'circle',
      //       source: {
      //         type: 'geojson',
      //         data: {
      //           type: 'FeatureCollection',
      //           features: [
      //             {
      //               type: 'Feature',
      //               properties: {},
      //               geometry: {
      //                 type: 'Point',
      //                 coordinates: endcoords
      //               }
      //             }
      //           ]
      //         }
      //       },
      //       paint: {
      //         'circle-radius': 10,
      //         'circle-color': '#f30'
      //       }
      //     })
      //   }
      //   getRoute(endcoords)
      // })
    })
  }
  componentDidMount() {
    this.getCoords();
  }
  render() {
    console.log(this.props)
    var recipe;
    var ingredients;
    try {
      recipe = JSON.parse(this.props.event.recipe);
    } catch (e) {
      console.log(e); 
    }
    try {
      ingredients = JSON.parse(this.props.event.ingredients);
    } catch (e) {
      console.log(e); 
    }

    var startDate = new Date(this.props.event.start.toString())
    var endDate = new Date(this.props.event.end.toString());
    console.log(recipe);
    return (
      <div id="parent">
        <div className="event">
          <div className="event-info">
            <img alt="#" src={recipe.image} />
            <div className="event-details">
              <font size="35"><b>{this.props.event.title}</b></font>
              <div className="event-date">
                <span>Start: {startDate.toLocaleString('en-GB', { timeZone: 'UTC' })}</span>
                <span>End: {endDate.toLocaleString('en-GB', { timeZone: 'UTC' })}</span>
              </div>
              <Collapsible transitionTime={300} trigger="Click for ingredients">
                {ingredients && ingredients.length > 1 ? (ingredients.map((item, key) =>
                  <li key={key}>
                    {`${item}`}
                  </li>
                )) : <li>No ingredients</li>}
              </Collapsible>
              <a href={recipe.url} target="_blank" rel="noopener noreferrer">Click here for the full recipe</a>
            </div>
          </div>
          <span>Attendees: {this.props.event.attendees.toString().replace('[', '').replace(']', '')}</span>

          {!this.props.event.attendees.includes(this.props.user[0].username) ? <button onClick={this.joinEvent} className="event-join" class='bstyle1 bred'>Join</button> : null}

        </div>

        <div className="map">
          <div id='mapcontainer'>
            <div id='menu'>
              <button id='driving' className='bstyle1 bred click' value='driving'>
                Driving
          </button>
              <button id='cycling' className='bstyle1 bred click' value='cycling'>
                Cycling
          </button>
              <button id='walking' className='bstyle1 bred click' value='Walking'>
                Walking
          </button>
              <form id='uberlinkform' target='_blank' action={this.state.uberLink}>
                <input type='image' src={require('./Uber_Logo_White_Cropped.png')} id='order-uber' alt="Submit Form" value='Order Uber' width='80%' height='80%' />
              </form>
              <div id='menuinstructions'></div>
            </div>
            <div id='mapbox'>
              <div id='map'></div>
            </div>
          </div>
        </div>
        <div className="recipe-event-videos">
        {recipe.video && recipe.video.length > 1 ? (recipe.video.map((item, key) =>
          <div className="recipe-video-item">
            <iframe title={key} key={key} width="350" height="280"
              src={`https://www.youtube.com/embed/${item}`}>
            </iframe>
          </div>
        )) : <div className="recipe-video-item">We're sorry! No videos were found</div>}
        </div>
      </div>
    )
  }
}
export default Event
