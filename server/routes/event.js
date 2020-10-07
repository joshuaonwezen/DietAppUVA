var express = require('express');
var router = express.Router();
const utils = require('../data/utils')

router.get('/eventcreate/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const { title, start, end, username, address, recipe, ingredients } = req.query;
    const q = "INSERT INTO dscs.events (title, id, attendees, start, end, address, recipe, host, ingredients) VALUES ('"+title+"','"+Math.floor(new Date() / 1000)+"', '"+username+"', '"+start+"', '"+end+"', '"+address+"', '"+recipe+"', '"+username+", '"+ingredients+"');"

    connection.query(q, (err, data) => {
        if (err) {
            return res.send(err, q)
        } else {
            return res.send(data);
        }
    })
});

router.get('/eventget/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const { username } = req.query;
    const q = "SELECT * FROM dscs.events WHERE attendees LIKE '%"+username+"%';"

    connection.query(q, (err, data) => {
        if (err) {
            return res.send(err)
        } else {
            return res.send(data);
        }
    })
});

router.get('/eventgetall/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const q = "SELECT * FROM dscs.events;"

    connection.query(q, (err, data) => {
        if (err) {
            return res.send(err)
        } else {
            return res.send(data);
        }
    })
});

router.get('/eventupdate/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const { id, attendees } = req.query;
    const q = "UPDATE dscs.events SET attendees = '"+attendees+"' WHERE id='"+id+"';"

    connection.query(q, (err, data) => {
        if (err) {
            return res.send(err)
        } else {
            return res.send(data);
        }
    })
});

module.exports = router;
