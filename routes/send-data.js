var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var fs = require("fs");
var Item = require('../models/item');
var DataFramePart = require('../models/data-frame-part');
var DataFrameValue = require('../models/data-frame-value');
var DataFrame = require('../models/data-frame');
var DescFrame = require('../models/desc-frame');

var mongoose = require('mongoose');
var InfiniteLoop = require('infinite-loop');

var ilArray = [];
var descFrameIterationArray = [];
var rangeValuesArray = [];
var valuesArray = [];


// ///////////////////////////////////////////////////////////////////////////////////////////////////// SOCKET.IO

let http = require('http').Server(express);
let io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('connected to socket');

    socket.on('disconnect', function () {
        console.log('disconnected from socked');
    });

    socket.on('add-message', (message) => {
        io.emit('message', { type: 'new-message', text: message });
    });
});

http.listen(5000, () => {
    console.log('started on port 5000');
});


// // http://www.syntaxsuccess.com/viewarticle/socket.io-with-rxjs-in-angular-2.0

// ///////////////////////////////////////////////////////////////////////////////////////////////////// 



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

        if (items != null && items.length > 0) {
            console.log('');
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemId = item._doc._id.toString();
                if (ilArray[itemId] != null) {
                    item._doc['il'] = true;
                } else {
                    item._doc['il'] = false;
                }
                items[i] = item;
            }

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
    let itemIdStr = req.body.itemId;
    if (ilArray[itemIdStr] != null) { // element istnieje - stop i usun element
        ilArray[itemIdStr].stop();
        ilArray[itemIdStr] = null;
        descFrameIterationArray[itemIdStr] = null;
        //rangeValuesArray[dataFramePart._id.toString()] = null;
        //valuesArray[itemIdStr] = null;
    } else {

        let itemId = mongoose.Types.ObjectId(itemIdStr);
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


                        fs.readFile("./myconfig.json", function (err, data) {
                            if (err) {
                                return res.status(500).json({
                                    title: 'Cannot read the config file.',
                                    error: { message: err.message }
                                });
                            }
                            try {
                                data = JSON.parse(data);
                                let data_frame_interval = data.data_frame_interval;
                                let desc_frame_interval = data.desc_frame_interval;

                                // element nie istnieje dodaj nowy
                                descFrameIterationArray[itemIdStr] = 0;
                                let il = new InfiniteLoop;
                                il.add(ilGenerateFrames, dataFrameParts, dataFrameValues, req.body.name, req.body.desc, desc_frame_interval, itemIdStr);
                                il.setInterval(data_frame_interval);
                                il.onError(function (error) {
                                    console.log(error);
                                });
                                il.run();

                                ilArray[itemIdStr] = il;

                                res.status(201).json({
                                    message: 'Success',
                                    obj: dataFrameValues
                                });

                            } catch (e) {
                                return res.status(500).json({
                                    title: 'Cannot read the config file.',
                                    error: { message: e.message }
                                });
                            }
                        });



                    });
            });
    }
});


function ilGenerateFrames(dataFrameParts, dataFrameValues, itemName, itemDesc, descFrameInterval, itemIdStr) {
    let jsonDataString = '{ ';
    let jsonDescString = '{ ';
    let valueDataString = '"VALUES": {'
    let valueDescString = '"VALUES": {'
    for (let i = 0; i < dataFrameParts.length; i++) {
        let dataFramePart = dataFrameParts[i]._doc;
        let jsonPart = getJsonPart(dataFramePart, dataFrameValues, itemIdStr);
        if (dataFramePart.descFramePart == "id" || dataFramePart.descFramePart == "date") {
            jsonDataString += jsonPart[0] + ', ';
            jsonDescString += jsonPart[1] + ', ';
        }

        if (dataFramePart.descFramePart == "value") {
            valueDataString += jsonPart[0] + ', ';
            valueDescString += jsonPart[1] + ', ';
        }
    }    

    if (valueDescString.endsWith(', ')) {
        valueDescString = valueDescString.substring(0, valueDescString.length - 2);
    }

    if (valueDataString.endsWith(', ')) {
        valueDataString = valueDataString.substring(0, valueDataString.length - 2);
    }
    valueDataString +=  ' }';
    valueDescString += ' }';

    jsonDataString += valueDataString + ' }';
    jsonDescString += valueDescString + ',';

    jsonDescString += ' "NAME": "' + itemName + '", ';
    jsonDescString += ' "DESC": "' + itemDesc + '" }';

    let jsonData = JSON.parse(jsonDataString);
    let jsonDesc = JSON.parse(jsonDescString);
    new DataFrame(jsonData).save(function (err, result) {
        if (err) {
            console.log('An error occurred');
            console.log(err);
            return false;
        }
        descFrameIterationArray[itemIdStr] = descFrameIterationArray[itemIdStr] + 1;
        if (descFrameIterationArray[itemIdStr] == descFrameInterval) {
            descFrameIterationArray[itemIdStr] = 0;
            new DescFrame(jsonDesc).save(function (err, result) {
                if (err) {
                    console.log('An error occurred');
                    console.log(err);
                    return false;
                }
                io.emit('message', { type: 'new-message', text: '<b>Logger name: </b>' + itemName + '<br /><b>Data frame: </b>' + jsonDataString + '<br /><b>Desc frame: </b>' + jsonDescString });
            });
        } else {
            io.emit('message', { type: 'new-message', text: '<b>Logger name: </b>' + itemName + '<br /><b>Data frame: </b>' + jsonDataString });
        }

    });

}


function getDataFrameValue(dataFramePartId, dataFrameValues) {
    for (let i = 0; i < dataFrameValues.length; i++) {
        let dataFrameValue = dataFrameValues[i]._doc;
        let id = dataFrameValue.dataFramePartId.toString();
        if (id == dataFramePartId) {
            return dataFrameValue;
        }
    }

    return null;
}

function getJsonPart(dataFramePart, dataFrameValues, itemIdStr) {
    let jsonDataString = '';
    let jsonDescString = '';
    let dataFrameValue;
    if (dataFramePart.value == 'getdate') {
        let dateString = getDateTime();
        jsonDataString = '"' + dataFramePart.key + '": "' + dateString + '"';

        if (dataFramePart.descFramePart == "id") {
            jsonDescString = '"ID": { "KEY": "' + dataFramePart.key + '"}';
        }
        if (dataFramePart.descFramePart == "date") {
            jsonDescString = '"DATE": { "KEY": "' + dataFramePart.key + '"}';
        }
        if (dataFramePart.descFramePart == "value") {
            jsonDescString = '"' + dataFramePart.key + '": { }';
        }
    } else {
        dataFrameValue = getDataFrameValue(dataFramePart._id.toString(), dataFrameValues);
        if (dataFrameValue == null) {
            return ['', ''];
        }
    }

    if (dataFramePart.value == "const") {
        if (dataFramePart.descFramePart == "id") {            
            jsonDescString = '"ID": { "KEY": "' + dataFramePart.key + '", "VALUE": "' + dataFrameValue.value + '"}';
            
            jsonDataString = '"' + dataFramePart.key + '": "' + dataFrameValue.value + '"';
        }
        if (dataFramePart.descFramePart == "date") {            
            jsonDescString = '"DATE": { "KEY": "' + dataFramePart.key + '"}';
            jsonDataString = '"' + dataFramePart.key + '": "' + dataFrameValue.value + '"';
        }
        if (dataFramePart.descFramePart == "value") {
            if (dataFrameValue.arrayLen == null || dataFrameValue.arrayLen == '' || dataFrameValue.arrayLen <= 0) {
                arrayLen = 1;
            } else {
                arrayLen = dataFrameValue.arrayLen;
            }
            jsonDataString = '"' + dataFramePart.key + '": [';
            for (let i = 0; i < arrayLen; i++) {
                jsonDataString += '"' + dataFrameValue.value + '"';
                if (arrayLen != i + 1) {
                    jsonDataString += ', ';
                }
            }
            jsonDataString += ' ]';

            jsonDescString = '"' + dataFramePart.key + '": { "desc": "' + (dataFrameValue.desc != null ? dataFrameValue.desc : '') + '"}';
        }
    }

    if (dataFramePart.value == "range") {
        let arrayLen = 0;
        if (dataFrameValue.arrayLen == null || dataFrameValue.arrayLen == '' || dataFrameValue.arrayLen == 0) {
            arrayLen = 1;
        } else {
            arrayLen = dataFrameValue.arrayLen;
        }
        let valueMin = dataFrameValue.valueMin;
        let valueMax = dataFrameValue.valueMax;
        let precision = dataFrameValue.precision;
        let randomInterval = dataFrameValue.randomInterval;

        let value = 0;
        let randomDirection = 'normal';
        if (dataFrameValue.randomDirection == 'up' || dataFrameValue.randomDirection == 'bottom') {
            randomDirection = dataFrameValue.randomDirection;
        }

        if (rangeValuesArray[dataFramePart._id.toString()] != null) { // element istnieje - dodaj/odejmij przedzial
            let sign = 0;
            if (randomDirection == 'normal') {
                sign = getRandomNumber(-1, 1, 0);
            }
            if (randomDirection == 'up') {
                sign = getRandomNumber(-1, 5, 0);
                if (sign > 0) {
                    sign = 1;
                }
            }
            if (randomDirection == 'down') {
                sign = getRandomNumber(-5, 1, 0);
                if (sign < 0) {
                    sign = -1;
                }
            }
            randomInterval = sign * randomInterval;
            value = (rangeValuesArray[dataFramePart._id.toString()] * 1) + randomInterval;
            value = value.toFixed(precision) * 1;

            if (value > valueMax) {
                value = valueMax;
            }
            if (value < valueMin) {
                value = valueMin;
            }
            rangeValuesArray[dataFramePart._id.toString()] = value;
        } else { // losuj nowy
            value = getRandomNumber(valueMin, valueMax, precision);
            rangeValuesArray[dataFramePart._id.toString()] = value;
        }
        jsonDataString = '"' + dataFramePart.key + '": [';

        if (valuesArray[dataFramePart._id.toString()] != null) { // jezeli jest tablica, przesun wszystkie wartosci o 1 i dodaj na jej poczatek nowa wartosc
            let tmpArray = valuesArray[dataFramePart._id.toString()];
            for (let i = tmpArray.length - 1; i > 0; i--) {
                tmpArray[i] = tmpArray[i - 1];
            }
            tmpArray[0] = value;
            valuesArray[dataFramePart._id.toString()] = tmpArray;
        } else {
            let tmpArray = [];
            for (let i = 0; i < arrayLen; i++) {
                if (i == 0) {
                    tmpArray.push(value);
                } else {
                    tmpArray.push('');
                }
            }
            valuesArray[dataFramePart._id.toString()] = tmpArray;
        }

        let tmpArray = valuesArray[dataFramePart._id.toString()];
        for (let i = 0; i < tmpArray.length; i++) {
            jsonDataString += '"' + tmpArray[i] + '"';
            if (tmpArray.length != i + 1) {
                jsonDataString += ', ';
            }
        }

        jsonDataString += ' ]';

        jsonDescString = '"' + dataFramePart.key + '": { "desc": "' + (dataFrameValue.desc != null ? dataFrameValue.desc : '')
            + '", "valueMin": "' + (dataFrameValue.valueMin != null ? dataFrameValue.valueMin : '')
            + '", "valueMax":"' + (dataFrameValue.valueMax != null ? dataFrameValue.valueMax : '')
            + '", "warningMin": "' + (dataFrameValue.warningMin != null ? dataFrameValue.warningMin : '')
            + '", "warningMax": "' + (dataFrameValue.warningMax != null ? dataFrameValue.warningMax : '')
            + '", "criticalMin": "' + (dataFrameValue.criticalMin != null ? dataFrameValue.criticalMin : '')
            + '", "criticalMax": "' + (dataFrameValue.criticalMax != null ? dataFrameValue.criticalMax : '')
            + '" } ';

        if (dataFramePart.descFramePart == "id") {
            jsonDescString = '"ID": { "KEY": "' + dataFramePart.key + '", "VALUE": "' + value + '"}';
        }
    }

    if (dataFramePart.value == "set") {
        let arrayLen = 0;
        if (dataFrameValue.arrayLen == null || dataFrameValue.arrayLen == '' || dataFrameValue.arrayLen == 0) {
            arrayLen = 1;
        } else {
            arrayLen = dataFrameValue.arrayLen;
        }

        let valuesCount = 0;
        for (let key in Object.keys(dataFrameValue)) {
            if (Object.keys(dataFrameValue)[key].startsWith('value')) {
                valuesCount++;
            }
        }

        // let value = getRandomNumber(0, valuesCount, 0);
        // value = 'value' + value;
        // value = dataFrameValue[value];


        let value = 0;
        let randomDirection = 'normal';
        if (dataFrameValue.randomDirection == 'up' || dataFrameValue.randomDirection == 'bottom') {
            randomDirection = dataFrameValue.randomDirection;
        }
        if (rangeValuesArray[dataFramePart._id.toString()] != null) { // element istnieje - dodaj/odejmij przedzial
            let sign = 0;
            if (randomDirection == 'normal') {
                sign = getRandomNumber(-1, 1, 0);
            }
            if (randomDirection == 'up') {
                sign = getRandomNumber(-1, 5, 0);
                if (sign > 0) {
                    sign = 1;
                }
            }
            if (randomDirection == 'down') {
                sign = getRandomNumber(-5, 1, 0);
                if (sign < 0) {
                    sign = -1;
                }
            }
            value = (rangeValuesArray[dataFramePart._id.toString()] * 1) + (sign * 1);
            if (value > valuesCount - 1) {
                value = valuesCount - 1;
            }
            if (value < 0) {
                value = 0;
            }
            rangeValuesArray[dataFramePart._id.toString()] = (value * 1);
            value = 'value' + value;
            value = dataFrameValue[value];
        } else { // losuj nowy            
            value = getRandomNumber(0, valuesCount, 0);
            rangeValuesArray[dataFramePart._id.toString()] = value;
            value = 'value' + value;
            value = dataFrameValue[value];
        }

        if (valuesArray[dataFramePart._id.toString()] != null) { // jezeli jest tablica, przesun wszystkie wartosci o 1 i dodaj na jej poczatek nowa wartosc
            let tmpArray = valuesArray[dataFramePart._id.toString()];
            for (let i = tmpArray.length - 1; i > 0; i--) {
                tmpArray[i] = tmpArray[i - 1];
            }
            tmpArray[0] = value;
            valuesArray[dataFramePart._id.toString()] = tmpArray;
        } else {
            let tmpArray = [];
            for (let i = 0; i < arrayLen; i++) {
                if (i == 0) {
                    tmpArray.push(value);
                } else {
                    tmpArray.push('');
                }
            }
            valuesArray[dataFramePart._id.toString()] = tmpArray;
        }

        jsonDataString = '"' + dataFramePart.key + '": [';

        let tmpArray = valuesArray[dataFramePart._id.toString()];
        for (let i = 0; i < tmpArray.length; i++) {
            jsonDataString += '"' + tmpArray[i] + '"';
            if (tmpArray.length != i + 1) {
                jsonDataString += ', ';
            }
        }

        // for (let i = 0; i < arrayLen; i++) {
        //     jsonDataString += '"' + value + '"';
        //     if (arrayLen != i + 1) {
        //         jsonDataString += ', ';
        //     }
        // }
        jsonDataString += ' ]';

        jsonDescString = '"' + dataFramePart.key + '": { "desc": "' + (dataFrameValue.desc != null ? dataFrameValue.desc : '')
            + '", "warningMin": "' + (dataFrameValue.warningMin != null ? dataFrameValue.warningMin : '')
            + '", "warningMax": "' + (dataFrameValue.warningMax != null ? dataFrameValue.warningMax : '')
            + '", "criticalMin": "' + (dataFrameValue.criticalMin != null ? dataFrameValue.criticalMin : '')
            + '", "criticalMax": "' + (dataFrameValue.criticalMax != null ? dataFrameValue.criticalMax : '')
            + '" } ';

        if (dataFramePart.descFramePart == "id") {
            jsonDescString = '"ID": { "KEY": "' + dataFramePart.key + '", "VALUE": "' + value + '"}';
        }
    }

    return [jsonDataString, jsonDescString];
}

function getDateTime() {
    let now = new Date();
    let time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
    let yyyy = now.getFullYear();
    let mm = now.getMonth() + 1;
    let dd = now.getDate();

    mm = (mm > 9 ? '' : '0') + mm;
    dd = (dd > 9 ? '' : '0') + dd;

    return yyyy + '-' + mm + '-' + dd + ' ' + time;
}


function getRandomNumber(valueMin, valueMax, precision) {
    let random = Math.random() * (valueMax - valueMin) + valueMin;
    return parseFloat(random).toFixed(precision);
}

module.exports = router;