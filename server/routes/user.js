var express = require('express');
var router = express.Router();

router.get('/register/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const { username, password, address, email, phone, preferences } = req.query;
    const q = "INSERT INTO dscs.user (username, password, address, email, phone, preferences) VALUES ('"+username+"', '"+password+"', '"+address+"', '"+email+"', '"+phone+"', '"+preferences+"');"

    connection.query(q, (err, data) => {
        if (err) {
            return res.send(err)
        } else {
            return res.send(data);
        }
    })
});

router.get('/login/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const { username, password } = req.query;
    const q = "SELECT * FROM dscs.user WHERE username='"+username+"' AND password='"+password+"';"

    connection.query(q, (err, data) => {
        if (err) {
            return res.send(err)
        } else {
            return res.send(data);
        }
    })
});

module.exports = router;