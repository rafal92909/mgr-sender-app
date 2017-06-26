var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log('send data');
    res.status(201).json({
        message: 'send data'
    });
});


router.post('/', function (req, res, next) {
    console.log('send data');
    res.status(201).json({
        message: 'send data'
    });
});


module.exports = router;