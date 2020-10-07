var express = require('express');
var router = express.Router();

var search = require('./services/apiSearch')


router.get('/', (req, res) => {
    res.send('Homepage')
});

router.get('/search/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const value = req.query;
    const recipe = await search.requestRecipeData(value);
    const data = { 
         recipe: recipe,
    };
    return res.send(data);
});

module.exports = router;