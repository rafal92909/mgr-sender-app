var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var fs = require("fs");
var Item = require('../models/item');
var DataFramePart = require('../models/data-frame-part');

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

router.post('/insert-item', function (req, res, next) {

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

router.delete('/delete-item/:id', function (req, res, next) {
    Item.findById(req.params.id, function (err, item) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!item) {
            return res.status(500).json({
                title: 'No item found!',
                error: { message: 'Item not found' }
            });
        }

        // DataFramePart.find({ item: item._id })
        //     .exec(function (err, dataFrameParts) {
        //         if (err) {
        //             return res.status(500).json({
        //                 title: 'An error occured',
        //                 error: err
        //             });
        //         }
        DataFramePart.remove({ item: item._id }, function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }

            item.remove(function (err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                res.status(200).json({
                    message: 'Deleted item',
                    obj: result
                });
            });

        });
        //});
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


router.post('/insert-data-frame-part', function (req, res, next) {
    Item.findById(req.body.itemId, function (err, item) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        var dataFramePart = new DataFramePart({
            key: req.body.key,
            type: req.body.type,
            value: req.body.value,
            descFramePart: req.body.descFramePart,
            item: item
        });

        dataFramePart.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        });
    });

});

router.delete('/delete-data-frame-part/:id', function (req, res, next) {
    DataFramePart.findById(req.params.id, function (err, dataFramePart) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!dataFramePart) {
            return res.status(500).json({
                title: 'No dataFramePart found!',
                error: { message: 'Part of data frame not found' }
            });
        }
        dataFramePart.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted part of data frame',
                obj: result
            });
        });
    });
});

module.exports = router;