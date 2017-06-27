var express = require('express');
var router = express.Router();


// router.get('/', function (req, res, next) {
//     console.log('set data');
//     res.status(201).json({
//         message: 'set data'
//     });
// });


router.post('/', function (req, res, next) {
    console.log('set data');
    res.status(201).json({
        message: 'set data'
    });
});

module.exports = router;