import React from 'react'
import Map from './components/Map/Map.js'
import Recipe from './components/Recipe/Recipe.js'
import Register from './components/Register/Register.js'
import Settings from './components/Settings/Settings.js'
import Event from './components/Event/Event.js'
import EventCalendar from './components/Calendar/Calendar.js'
import PersonalCalendar from './components/Calendar/PersonalCalendar.js'

import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      data: '',
      view: 'register',
      loggedIn: false
    }

    this.responseGoogle = this.responseGoogle.bind(this)
    this.searchRecipe = this.searchRecipe.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.dinnerChoice = this.dinnerChoice.bind(this)
    this.setUser = this.setUser.bind(this)
    this.navigate = this.navigate.bind(this)
    this.setEvent = this.setEvent.bind(this)
  }

  responseGoogle = response => {
    console.log(response)
    this.setState({
      loggedIn: true,
      googleData: response,
      name: response.profileObj.name,
      email: response.profileObj.email
    })
  }

  searchRecipe = async e => {
    e.preventDefault()
    this.setState({ loading: true })
    var that = this
    var diet;
    var health;
    var preferences;
    try {
      preferences = JSON.parse(this.state.user[0].preferences);
      diet = preferences.diet;
    } catch (e) {
      console.log(e); 
    }
    try {
      preferences = JSON.parse(this.state.user[0].preferences);
      health = preferences.health;
    } catch (e) {
      console.log(e); 
    }

    try {
      await fetch(`https://dscs.cloudno.de/search?value=${this.state.value}&diet=${diet}&health=${health}`, {
        crossDomain: true,
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(response => response.json())
        .then(function (response) {
          var data = response
          that.setState({ data: data, loading: false })
          console.log(data)
        })
        .catch(err => {
          that.setState({ loading: false });

          console.log(err)
        })
    } catch (err) {
      that.setState({ loading: false });

      console.log(err)
    }
  }

  dinnerChoice(choice) {
    this.setState({ choice: choice })
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  navigate(view) {
    this.setState({ view: view })
  }

  setEvent(data) {
    this.setState({ selectedEvent: data })
  }

  setUser(user) {
    this.setState({ user: user })
  }

  render() {
    const navigation = (
      <nav>
        <ul>
          <li
            className={this.state.view === 'home' ? 'selected' : ''}
            onClick={() => {
              this.navigate('home')
            }}
          >
            Home
          </li>
          <li
            className={this.state.view === 'personalcalendar' ? 'selected' : ''}
            onClick={() => {
              this.navigate('personalcalendar')
            }}
          >
            My Events
          </li>
          {/* <li
            className={this.state.view === 'map' ? 'selected' : ''}
            onClick={() => {
              this.navigate('map')
            }}
          >
            Map
          </li> */}
          {this.state.user ? (
            <li
              className={this.state.view === 'settings' ? 'selected' : ''}
              onClick={() => {
                this.navigate('settings')
              }}
            >
              Settings
            </li>
          ) : null}
          {this.state.loggedIn === false ? (
            <li
              className={this.state.view === 'register' ? 'selected' : ''}
              onClick={() => {
                this.navigate('register')
              }}
            >
              {this.state.user && this.state.user.length > 0
                ? this.state.user[0].username
                : 'Account'}
            </li>
          ) : (
              <li>
                {this.state.name}
              </li>
            )}
        </ul>
      </nav>
    )

    const homeScreen = (
      <article>
        {this.state.view === 'home' ? (
          <article>
            {this.state.choice === 'cook' ? (
              <div className='home-screen--recipe'>
                <button style={{marginTop: 20}}
                  onClick={() => {
                    this.dinnerChoice('')
                  }}
                  className='dinner-back'
                >
                  Back
                </button>
                <form onSubmit={this.searchRecipe}>
                  <span style={{marginTop: 20, marginBottom: 8}}>Search for recipes...</span>
                  <input onChange={this.handleChange} type='text'></input>
                  <input type='submit' class='bstyle1 bred' value='Search' />
                </form>
                <Recipe data={this.state.data} setEvent={this.setEvent} navigate={this.navigate} user={this.state.user}></Recipe>
              </div>
            ) : this.state.choice === 'join' ? (
              <div className='home-screen--calendar'>
                <button
                  onClick={() => {
                    this.dinnerChoice('')
                  }}
                  className='dinner-back'
                >
                  Back
                </button>
                <EventCalendar navigate={this.navigate} setEvent={this.setEvent}></EventCalendar>
              </div>
            ) : (
                  <div className='home-screen'>
                    <button style={{marginTop: 200}}
                      onClick={() => {
                        this.dinnerChoice('cook')
                      }}
                      className='dinner-choice dinner-cook'
                    >
                      Host a meal
                      </button>
                    {this.state.user ? (
                      <button style={{marginTop: 200}}
                        onClick={() => {
                          this.dinnerChoice('join')
                        }}
                        className='dinner-choice dinner-join'
                      >
                        Join a meal
                      </button>
                    ) : null}
                  </div>
                )}
          </article>
        ) : null}
        {this.state.view === 'calendar' && this.state.user ? (
          <EventCalendar navigate={this.navigate} setEvent={this.setEvent} user={this.state.user}></EventCalendar>
        ) : this.state.view === 'calendar' && !this.state.user ? (
          <div>You must login first</div>
        ) : null}
        {this.state.view === 'personalcalendar' && this.state.user ? (
          <PersonalCalendar navigate={this.navigate} setEvent={this.setEvent} user={this.state.user}></PersonalCalendar>
        ) : this.state.view === 'personalcalendar' && !this.state.user ? (
          <div>You must login first</div>
        ) : null}
        {this.state.view === 'map' ? <Map data={this.state.data}></Map> : null}
        {this.state.view === 'settings' && this.state.user ? (
          <Settings name='testnaam'></Settings>
        ) : null}
        {this.state.view === 'register' ? (
          <Register setUser={this.setUser} navigate={this.navigate}></Register>
        ) : null}
        {this.state.view === 'event' ? (
          <Event navigate={this.navigate} event={this.state.selectedEvent} user={this.state.user}></Event>
        ) : null}
        {this.state.loading === true ? (
          <div className="lds-dual-ring"></div>
        ) : null}
      </article>
    )

    return (
      <div className='App'>
        {navigation}
        {homeScreen}
      </div>
    )
  }
}

export default App
