var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


/* GET home page. */
router.post('/', function (req, res, next) {
    // var pass = "";
    // var user = '{ "firstName": "R", "lastName": "M", "email": "test@test.pl", "password": "' + bcrypt.hashSync(req.body.password, 10) + '" }';

    // try {
    //     user = JSON.parse(texuser);
    // } catch (e) {
    //     return res.status(500).json({
    //         title: 'An error occured',
    //         error: err
    //     });
    // }

    // user.save(function (err, result) {
    //     if (err) {
    //         return res.status(500).json({
    //             title: 'An error occured',
    //             error: err
    //         });
    //     }

    //     res.status(201).json({
    //         message: 'User created',
    //         obj: result
    //     });
    // });
    console.log('signin success');
    res.status(201).json({
            message: 'User created'
    });
});

router.post('/login', function (req, res, next) {
    // User.findOne({ email: req.body.email }, function (err, user) {
    //     if (err) {
    //         return res.status(500).json({
    //             title: 'An error occured',
    //             error: err
    //         });
    //     }

    //     if (!user) {
    //         return res.status(500).json({
    //             title: 'Login failed',
    //             error: { message: 'Invalid login credentials' }
    //         });
    //     }

    //     if (!bcrypt.compareSync(req.body.password, user.password)) {
    //         return res.status(401).json({
    //             title: 'Login failed',
    //             error: { message: 'Invalid login credentials' }
    //         });
    //     }

    //     var token = jwt.sign({ user: user }, 'secret_string', { expiresIn: 60 });
    //     console.log('1 min');
    //     res.status(200).json({
    //         message: 'Successfully logged in',
    //         token: token,
    //         userId: user._id
    //     })

    // });

    console.log('login success');
    res.status(200).json({
        message: 'Successfully logged in'
    })
});

module.exports = router;
