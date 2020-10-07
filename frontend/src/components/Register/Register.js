import React from 'react'
import './Register.css'
import '../../App.css'
import Collapsible from 'react-collapsible';

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      address: '',
      email: '',
      phone: '',
      preferences: [],
      diet: [],
      health: [],
      registered: false,
      loggedIn: false,
      setUser: this.props.setUser
    }

    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    this.changeUsername = this.changeUsername.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.changeAddress = this.changeAddress.bind(this)
    this.changeEmail = this.changeEmail.bind(this)
    this.changePhone = this.changePhone.bind(this)
    this.changePreferences = this.changePreferences.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    console.log(e.target.id, e.target.value, e.target.checked);
    if (e.target.id === 'balanced' || e.target.id === 'low-carb' || e.target.id === 'high-protein' || e.target.id === 'high-fiber' || e.target.id === 'low-fat' || e.target.id === 'low-sodium') {
      var diet = this.state.diet;
      diet.push(e.target.id)
      this.setState({
        diet: diet
      })
      console.log(diet);
    } else if (e.target.id === 'vegetarian' || e.target.id === 'vegan' || e.target.id === 'gluten-free' || e.target.id === 'dairy-free' || e.target.id === 'fish-free' || e.target.id === 'peanut-free') {
      var health = this.state.health;
      health.push(e.target.id)
      this.setState({
        health: health
      })
    }
  }

  changeUsername(text) {
    this.setState({ username: text.target.value })
  }
  changePassword(text) {
    this.setState({ password: text.target.value })
  }
  changeAddress(text) {
    this.setState({ address: text.target.value })
  }
  changeEmail(text) {
    this.setState({ email: text.target.value })
  }
  changePhone(text) {
    this.setState({ phone: text.target.value })
  }
  changePreferences(text) {
    this.setState({ preferences: text.target.value })
  }

  login = async e => {
    e.preventDefault()
    var that = this
    try {
      await fetch(
        `https://dscs.cloudno.de/login?username=${this.state.username}&password=${this.state.password}`,
        {
          crossDomain: true,
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
        .then(response => response.json())
        .then(function (response) {
          var data = response
          if (data.length > 0) {
            that.setState({ login: data, loggedIn: true })
            that.props.setUser(data)
            that.props.navigate('home')
          } else {
            console.log('Not logged in')
          }
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  register = async e => {
    e.preventDefault()
    var that = this
    var preferences = {
      diet: this.state.diet,
      health: this.state.health
    }
    var prefencesString = JSON.stringify(preferences)
    console.log(this.state)
    try {
      await fetch(
        `https://dscs.cloudno.de/register?username=${this.state.username}&password=${this.state.password}&address=${this.state.address}&preferences=${prefencesString}`,
        {
          crossDomain: true,
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
        .then(response => response.json())
        .then(function (response) {
          var data = response
          that.setState({ register: data, registered: true })
          console.log(that.state)
        })
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <article className="registerform">
        <div className='login'>
          {this.state.loggedIn === false ? (
            <form onSubmit={this.login}>
              <span>
                <b>Have an account?</b>
              </span>
              <div>
                <span>Username:</span>
                <input onChange={this.changeUsername} type='text'></input>
              </div>
              <div>
                <span>Password:</span>
                <input onChange={this.changePassword} type='password'></input>
              </div>
              <div>
                <input type='submit' class='bstyle1 bred' value='Submit' />
              </div>
            </form>
          ) : null}
        </div>
        <div className='register'>
          {this.state.registered === false ? (
            <form onSubmit={this.register}>
              <span>
                <b>Don't have an account?</b>
              </span>
              <div>
                <span>Username:</span>
                <input onChange={this.changeUsername} type='text'></input>
              </div>
              <div>
                <span>Password:</span>
                <input onChange={this.changePassword} type='password'></input>
              </div>
              <div>
                <span>Address:</span>
                <input onChange={this.changeAddress} type='text'></input>
              </div>
              <div>
                <span>Email:</span>
                <input onChange={this.changeEmail} type='text'></input>
              </div>
              <div>
                <span>Phone:</span>
                <input onChange={this.changePhone} type='number'></input>
              </div>
              <div>
                <Collapsible className="preferences-menu" transitionTime="300" trigger="Dietary preferences/restrictions">
                  <span>Vegetarian: </span>
                  <input onChange={this.handleChange} type="checkbox" id="vegetarian" name="vegetarian"></input><br></br>

                  <span>Vegan: </span>
                  <input onChange={this.handleChange} type="checkbox" id="vegan" name="vegan"></input><br></br>

                  <span>Gluten-free: </span>
                  <input onChange={this.handleChange} type="checkbox" id="gluten-free" name="gluten-free"></input><br></br>

                  <span>Dairy-free: </span>
                  <input onChange={this.handleChange} type="checkbox" id="dairy-free" name="dairy-free"></input><br></br>

                  <span>Fish-free: </span>
                  <input onChange={this.handleChange} type="checkbox" id="fish-free" name="fish-free"></input><br></br>

                  <span>Peanut-free: </span>
                  <input onChange={this.handleChange} type="checkbox" id="peanut-free" name="peanut-free"></input><br></br>

                  <span>Balanced: </span>
                  <input onChange={this.handleChange} type="checkbox" id="balanced" name="balanced"></input><br></br>

                  <span>Low-carb: </span>
                  <input onChange={this.handleChange} type="checkbox" id="low-carb" name="low-carb"></input><br></br>

                  <span>High-protein: </span>
                  <input onChange={this.handleChange} type="checkbox" id="high-protein" name="high-protein"></input><br></br>

                  <span>High-fiber: </span>
                  <input onChange={this.handleChange} type="checkbox" id="high-fiber" name="high-fiber"></input><br></br>

                  <span>Low-fat: </span>
                  <input onChange={this.handleChange} type="checkbox" id="low-fat" name="low-fat"></input><br></br>

                  <span>Low-sodium: </span>
                  <input onChange={this.handleChange} type="checkbox" id="low-sodium" name="low-sodium"></input><br></br>
                </Collapsible>
              </div>
              <div>
                <input type='submit' class='bstyle1 bred' value='Submit' />
              </div>
            </form>
          ) : (
              <span>You have successfully registered.</span>
            )}
        </div>
      </article>
    )
  }
}

export default Register
