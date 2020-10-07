import React from 'react';
import './Recipe.css';
import DateTimePicker from 'react-datetime-picker'
import Collapsible from 'react-collapsible';

class Recipe extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startTime: '',
            endTime: '',
            collapsedRecipe: ''
        }

        this.recipeChosen = this.recipeChosen.bind(this)
        this.setStartTime = this.setStartTime.bind(this)
        this.setEndTime = this.setEndTime.bind(this)
        this.setCollapsedRecipe = this.setCollapsedRecipe.bind(this)
    }
    recipeChosen = async e => {
        e.preventDefault()
        var recipe = e.target.dataset.recipe;
        var recipeData = JSON.parse(recipe);
        var fullRecipe = {
            label: recipeData.label,
            uri: recipeData.url,
            image: recipeData.image,
        }
        var ingredients = recipeData.ingredientLines;

        if(recipeData.video && recipeData.video.items && recipeData.video.items.length > 1){
            var videos = []
            for(var i = 0; i < 2; i++){
                videos.push(recipeData.video.items.slice(0, 2)[i].id.videoId)
            }
            fullRecipe.video = videos;
        }
        fullRecipe = JSON.stringify(fullRecipe);
        ingredients = JSON.stringify(ingredients);
        console.log(ingredients)
        this.setState({ loading: true })
        var that = this
        try {
            await fetch(`https://dscs.cloudno.de/eventcreate?title=${JSON.parse(recipe).label}&start=${this.state.startTime.toString()}&end=${this.state.endTime.toString()}&username=${this.props.user[0].username}&address=${this.props.user[0].address}&recipe=${fullRecipe}&ingredients=${ingredients}`, {
                crossDomain: true,
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
                .then(response => response.json())
                .then(function (response) {
                    var data = response
                    console.log(data, that.props)
                    that.props.navigate('personalcalendar')
                    that.setState({ loading: false })

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

    setCollapsedRecipe(recipe) {
        console.log(recipe);
        this.setState({ collapsedRecipe: recipe.label })
    }

    setStartTime(time) {
        console.log(time);
        this.setState({ startTime: time })
        this.setEndTime(time)
    }
    setEndTime(time) {
        var endDate = new Date(time);
        endDate.setHours(endDate.getHours() + 2);
        this.setState({ endTime: endDate })
    }
    render() {
        const items = this.props.data && this.props.data.recipe && this.props.data.recipe.hits && this.props.data.recipe.hits.length > 0 ? (this.props.data.recipe.hits.map((item, key) =>
            <div className="recipe-item" key={key}>
                <div className="recipe-item-details">
                    <img alt="#" src={item.recipe.image} />
                    <ul>
                        <li><font size="35"><b>{item.recipe.label}</b></font></li>
                        <Collapsible transitionTime={300} trigger="Click for ingredients">
                            {item.recipe.ingredients && item.recipe.ingredients.length > 1 ? (item.recipe.ingredients.map((item, key) =>
                                <li key={key}>
                                    {`- ${item.text}`}
                                </li>
                            )) : <li>No ingredients</li>}
                        </Collapsible>
                        <li> <a href={item.recipe.url} target="_blank" class='Collapsible__trigger' rel="noopener noreferrer">Click here for the full recipe</a> </li>
                    </ul>
                </div>
                {/* <Collapsible className="recipe-video-collapse" transitionTime={300} trigger="Need help on how to prepare?"> */}
                <div className="recipe-video-list">
                    <span><b>Need help on how to prepare? Watch these videos!</b></span>
                    <div>
                        {item.recipe.video && item.recipe.video.items && item.recipe.video.items.length > 1 ? (item.recipe.video.items.slice(0, 2).map((item, key) =>
                            <div className="recipe-video-item">
                                <iframe title={key} key={key} width="350" height="280"
                                    src={`https://www.youtube.com/embed/${item.id.videoId}`}>
                                </iframe>
                            </div>
                        )) : <div className="recipe-video-item">We're sorry! No videos were found</div>}
                    </div>
                </div>
                {/* </Collapsible> */}



                {this.props.user ? (
                    <div>
                        <button onClick={() => this.setCollapsedRecipe(item.recipe)} className="collapse-cook">I'm going to cook this</button>
                        {this.state.collapsedRecipe === item.recipe.label ? (
                            <form data-recipe={JSON.stringify(item.recipe)} onSubmit={this.recipeChosen} className="event-create">
                                <div>
                                    <span>Time:</span><DateTimePicker disableClock={true} onChange={this.setStartTime} value={this.state.startTime} />
                                </div>
                                <label style={{marginBottom: 10}}>How many people can join you?: </label>
                                <input type="number" id="guest_amount" name="guest_amount" min="1" step="1" required></input>

                                <input type="submit" value="Create event" className="create-event-button"/>
                                {this.state.loading === true ? (
                                    <div className="lds-dual-ring"></div>
                                ) : null}
                            </form>
                        ) : null}
                    </div>
                ) : null}
            </div>
        )) : <div>We're sorry! No recipes were found</div>

        return (
            <div className="recipe-list">
                {items}
            </div>
        )
    }
}

export default Recipe;
