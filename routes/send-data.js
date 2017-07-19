var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var fs = require("fs");
var Item = require('../models/item');
var DataFramePart = require('../models/data-frame-part');
var DataFrameValue = require('../models/data-frame-value');
var mongoose = require('mongoose');

router.use('/', function (req, res, next) {
    if (req.url == "/") {
        return res.render('index');
    } else {
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
    }
});

//////////////////////////////////////////////////////////////////////////////////// ITEM
router.get('/get-items', function (req, res, next) {
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


//////////////////////////////////////////////////////////////////////////////////// DATA PART
router.get('/get-data-frame-parts', function (req, res, next) {
    DataFramePart.find({ item: req.query.itemId })
        .populate('item', '_id')
        .exec(function (err, dataFrameParts) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(201).json({
                message: 'Success',
                obj: dataFrameParts
            });
        });
});


//////////////////////////////////////////////////////////////////////////////////// GENERATE FRAMES
router.post('/generate-frames', function (req, res, next) {
    let itemId = req.body.itemId;
    itemId = mongoose.Types.ObjectId(itemId);

    DataFramePart.find({ item: req.body.itemId })
        .exec(function (err, dataFrameParts) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }

            var dfIDs;
            dfIDs = dataFrameParts.map(function (df) {
                return df._id;
            });

            DataFrameValue.find({ dataFramePartId: { $in: dfIDs } })
                .exec(function (err, dataFrameValues) {
                    if (err) {
                        return res.status(500).json({
                            title: 'An error occured',
                            error: err
                        });
                    }
                    res.status(201).json({
                        message: 'Success',
                        obj: dataFrameValues
                    });

                });
        });
});

module.exports = router;