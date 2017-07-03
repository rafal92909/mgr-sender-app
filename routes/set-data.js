var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var fs = require("fs");
var Item = require('../models/item');

router.use('/', function (req, res, next) {

    fs.readFile("./myconfig.json", function (err, data) {
        if (err) {
            return res.status(500).json({
                title: 'Cannot read the config file.',
                error: { message: err.message }
            });
        }
        try {
            data = JSON.parse(data);
            jwt.verify(req.query.token, data.secret_string, function (err, decoded) {
                if (err) {
                    return res.status(401).json({
                        title: 'Not Authenticated',
                        error: err
                    });
                }
                next();
            });
        } catch (e) {
            return res.status(500).json({
                title: 'Cannot read the config file.',
                error: { message: e.message }
            });
        }
    });

});

router.get('/', function (req, res, next) {
    Item.find().exec(function (err, items) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(201).json({
                message: 'Success',
                obj: items
            });
        });
});

router.post('/', function (req, res, next) {

    var item = new Item({
        name: req.body.name,
        desc: req.body.desc
    });

    item.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        item.save();
        res.status(201).json({
            message: 'Saved message',
            obj: result
        });
    });
});

module.exports = router;