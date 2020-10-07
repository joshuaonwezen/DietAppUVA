var express = require('express')
var router = express.Router();
const dotenv = require('dotenv').config();
const youtubeApiKey = process.env.DB_YT

const youtubeOptions = {
    q: 'recipe pasta',
    type: 'video',
    part: 'snippet'
};

const recipeOptions = {
    method: 'GET',
    url: 'https://api.edamam.com/search',
    qs:
    {
        q: 'pasta',
        page: 1,
        app_key: 'bf5ece98f18199f220a58a0fb214ab50',
        app_id: '660dcd61',
        from: 0,
        to: 5
    },
    body: '{}'
};

function requestYoutubeData(query) {
    youtubeOptions.q = query;
    return new Promise(async function (resolve, reject) {
        try {
            await searchYoutube(youtubeApiKey, youtubeOptions, function (error, response) {
                if (error) throw new Error(error);
                resolve(response);
            });
        } catch (err) {
            console.log(err)
        } finally { }
    }).catch((err) => {
        console.log(err)
    });

}

function requestRecipeData(query) {
    recipeOptions.qs.q = query.value;
    return new Promise(async function (resolve, reject) {
        try {
            await request(recipeOptions, async function (error, response, body) {
                if (error) throw new Error(error);
                var data = JSON.parse(response.body);
                for(recipe in data.hits){
                    data.hits[recipe].recipe.video = await requestYoutubeData(data.hits[recipe].recipe.label);
                }
                resolve(data);
            });
        } catch (err) {
            console.log(err)
        } finally { }
    }).catch((err) => {
        console.log(err)
    });
}

module.exports.requestYoutubeData = requestYoutubeData;
module.exports.requestRecipeData = requestRecipeData;