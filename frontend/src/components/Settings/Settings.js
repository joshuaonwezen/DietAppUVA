import React from 'react';
import './Settings.css';
import '../../App.css';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Collapsible from 'react-collapsible';

class Settings extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            preferences: [],
            diet: [],
            health: []
        }

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
        } else if (e.target.id === 'vegetarian' || e.target.id === 'vegan' || e.target.id === 'gluten-free' || e.target.id === 'dairy-free' || e.target.id === 'fish-free' || e.target.id === 'peanut-free') {
          var health = this.state.health;
          health.push(e.target.id)
          this.setState({
            health: health
          })
        }
      }

    render() { 
       return (<div class="settings_form">
            <form onSubmit={this.updateSettings}>
                <span style={{marginTop: 13, marginBottom: 8}}>Name: </span>
                <input onChange={this.handleChange} type="text"  id="name" name="name"></input><br></br>

                <span style={{marginTop: 5, marginBottom: 8}}>Address: </span>
                <input onChange={this.handleChange} type="text"  id="address" name="address"></input><br></br>
                
                {/* <span>Maximum travel distance: </span>
                <input type="range" id="travelDistance" name="travelDistance" min="0" max="50" onChange={(e) => {this.updateSliderValue(e)}}></input>
                <input type="text" id="distanceValue" value=""></input><br></br> */}

                <Typography class= "travel-distance-slider" id="travel-distance-slider" gutterBottom>
                        Maximum travel distance (km):
                    </Typography>
                    <Slider
                        max={30}
                        min={0}
                        defaultValue={5}
                        // getAriaValueText={valuetext}
                        aria-labelledby="travel-distance-slider"
                        step={1}
                        valueLabelDisplay="on"
                    />

                <span style={{marginTop: 5, marginBottom: 8}}>Email Address: </span>
                <input onChange={this.handleChange} type="text"  id="email" name="email"></input><br></br>

                <span style={{marginTop: 5, marginBottom: 8}}>Phone number: </span>
                <input onChange={this.handleChange} type="text"  id="phonenumber" name="phonenumber"></input><br></br>

                <span style={{marginTop: 5, marginBottom: 8}}>Receive notifications: </span>
                <input onChange={this.handleChange} type="checkbox"  id="notifications" name="notifications"></input><br></br>

                <Collapsible className="preferences-menu" transitionTime = "300" trigger="Dietary preferences/restrictions">
                    <span>Vegetarian: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="vegetarian" name="vegetarian"></input><br></br>

                    <span>Vegan: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="vegan" name="vegan"></input><br></br>

                    <span>Gluten-free: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="gluten-free" name="gluten-free"></input><br></br>

                    <span>Dairy-free: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="dairy-free" name="dairy-free"></input><br></br>

                    <span>Fish-free: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="fish-free" name="fish-free"></input><br></br>

                    <span>Peanut-free: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="peanut-free" name="peanut-free"></input><br></br>

                    <span>Balanced: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="balanced" name="balanced"></input><br></br>

                    <span>Low-carb: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="low-carb" name="low-carb"></input><br></br>

                    <span>High-protein: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="high-protein" name="high-protein"></input><br></br>

                    <span>High-fiber: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="high-fiber" name="high-fiber"></input><br></br>

                    <span>Low-fat: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="low-fat" name="low-fat"></input><br></br>

                    <span>Low-sodium: </span>
                    <input onChange={this.handleChange} type="checkbox"  id="low-sodium" name="low-sodium"></input><br></br>
                </Collapsible>
                
                <input type="submit" class='bstyle1 bred' value="Submit"></input>
              </form>

        </div>)

    }
}

export default Settings;