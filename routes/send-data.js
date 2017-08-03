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

                        // element nie istnieje dodaj nowy
                        let il = new InfiniteLoop;
                        il.add(ilGenerateFrames, dataFrameParts, dataFrameValues, req.body.name);
                        il.setInterval(5 * 1000);
                        il.onError(function (error) {
                            console.log(error);
                        });
                        il.run();

                        ilArray[itemIdStr] = il;

                        res.status(201).json({
                            message: 'Success',
                            obj: dataFrameValues
                        });

                    });
            });
    }
});


function ilGenerateFrames(dataFrameParts, dataFrameValues, itemName) {
    let jsonDataString = "{ ";
    let jsonDescString = "{ ";
    let valueDataString = '"VALUES": [{'
    for (let i = 0; i < dataFrameParts.length; i++) {
        let dataFramePart = dataFrameParts[i]._doc;
        let jsonPart = getJsonPart(dataFramePart, dataFrameValues);
        if (dataFramePart.descFramePart == "id" || dataFramePart.descFramePart == "date") {
            jsonDataString += jsonPart[0] + ', ';
            jsonDescString += jsonPart[1] + ', ';
        }

        if (dataFramePart.descFramePart == "value") {
            valueDataString += jsonPart[0] + ', ';
            jsonDescString += jsonPart[1] + ', ';
        }
    }
    
    if (jsonDescString.endsWith(', ')) {
        jsonDescString = jsonDescString.substring(0, jsonDescString.length - 2);

    }
    if (valueDataString.endsWith(', ')) {
        valueDataString = valueDataString.substring(0, valueDataString.length - 2);
    }
    valueDataString += " }]";
    jsonDataString += valueDataString + " }";
    jsonDescString += " }";
    let jsonData = JSON.parse(jsonDataString);
    let jsonDesc = JSON.parse(jsonDescString);
    new DataFrame(jsonData).save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        new DescFrame(jsonDesc).save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            io.emit('message', { type: 'new-message', text: '<b>Logger name: </b>' + itemName + '<br /><b>Data frame: </b>' + jsonDataString + '<br /><b>Desc frame: </b>' + jsonDescString });
        });
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

function getJsonPart(dataFramePart, dataFrameValues) {
    let jsonDataString = '';
    let jsonDescString = '';
    let dataFrameValue;
    if (dataFramePart.value == 'getdate') {
        let dateString = getDateTime();
        jsonDataString = '"' + dataFramePart.key + '": "' + dateString + '"';

        if (dataFramePart.descFramePart == "id") {
            jsonDescString = '"ID": ["' + dataFramePart.key + '"]';
        }
        if (dataFramePart.descFramePart == "date") {
            jsonDescString = '"DATE": ["' + dataFramePart.key + '"]';
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
            jsonDescString = '"ID": ["' + dataFramePart.key + '", "' + dataFrameValue.value + '"]';
            jsonDataString = '"' + dataFramePart.key + '": "' + dataFrameValue.value + '"';
        }
        if (dataFramePart.descFramePart == "date") {
            jsonDescString = '"DATE": ["' + dataFramePart.key + '"]';
            jsonDataString = '"' + dataFramePart.key + '": "' + dataFrameValue.value + '"';
        }
        if (dataFramePart.descFramePart == "value") {
            if (dataFrameValue.arrayLen == null || dataFrameValue.arrayLen == '' || dataFrameValue.arrayLen == 0) {
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
        let arrayLen = dataFrameValue.arrayLen;
        if (dataFrameValue.arrayLen == null || dataFrameValue.arrayLen == '' || dataFrameValue.arrayLen == 0) {
            arrayLen = 1;
        } else {
            arrayLen = dataFrameValue.arrayLen;
        }
        let valueMin = dataFrameValue.valueMin;
        let valueMax = dataFrameValue.valueMax;
        let precision = dataFrameValue.precision;
        let randomInterval = dataFrameValue.randomInterval;

        let value = getRandomNumber(valueMin, valueMax, precision);

        jsonDataString = '"' + dataFramePart.key + '": [';
        for (let i = 0; i < arrayLen; i++) {
            jsonDataString += '"' + value + '"';
            if (arrayLen != i + 1) {
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
            jsonDescString = '"ID": ["' + dataFramePart.key + '", "' + value + '"]';
        }
    }

    if (dataFramePart.value == "set") {
        let arrayLen = dataFrameValue.arrayLen;
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

        let value = getRandomNumber(0, valuesCount, 0);
        value = 'value' + value;
        value = dataFrameValue[value];
        jsonDataString = '"' + dataFramePart.key + '": [';
        for (let i = 0; i < arrayLen; i++) {
            jsonDataString += '"' + value + '"';
            if (arrayLen != i + 1) {
                jsonDataString += ', ';
            }
        }
        jsonDataString += ' ]';

        jsonDescString = '"' + dataFramePart.key + '": { "desc": "' + (dataFrameValue.desc != null ? dataFrameValue.desc : '')
            + '", "warningMin": "' + (dataFrameValue.warningMin != null ? dataFrameValue.warningMin : '')
            + '", "warningMax": "' + (dataFrameValue.warningMax != null ? dataFrameValue.warningMax : '')
            + '", "criticalMin": "' + (dataFrameValue.criticalMin != null ? dataFrameValue.criticalMin : '')
            + '", "criticalMax": "' + (dataFrameValue.criticalMax != null ? dataFrameValue.criticalMax : '')
            + '" } ';

        if (dataFramePart.descFramePart == "id") {
            jsonDescString = '"ID": ["' + dataFramePart.key + '", "' + value + '"]';
        }
    }

    return [jsonDataString, jsonDescString];
}

function getDateTime() {
    let now = new Date();
    let time = now.toLocaleTimeString();
    let yyyy = now.getFullYear();
    let mm = now.getMonth() + 1;
    let dd = now.getDate();

    mm = (mm > 9 ? '' : '0') + mm;
    dd = (dd > 9 ? '' : '0') + dd;

    return yyyy + '-' + mm + '-' + dd + ' ' + time;
}

// TODO - losowanie range powinno byc tylko za pierwszym razem, a kazde nastepne to +- interval
// TODO - random przekracza wartosc maksymalna?, czasami zwraca null
// TODO - descFrame generuje sie co iles ramek z danymi
// TODO - ustawic czas co ile generowac ramki w parametrach globalnych
// TODO - dolozenie parametru arrayLen

function getRandomNumber(valueMin, valueMax, precision) {
    let random = Math.random() * (valueMax - valueMin) + valueMin;
    return parseFloat(random).toFixed(precision);
}

module.exports = router;