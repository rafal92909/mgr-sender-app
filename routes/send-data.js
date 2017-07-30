var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var fs = require("fs");
var Item = require('../models/item');
var DataFramePart = require('../models/data-frame-part');
var DataFrameValue = require('../models/data-frame-value');
var mongoose = require('mongoose');
var InfiniteLoop = require('infinite-loop');

var ilArray = [];
var iFunc = 0;


// ///////////////////////////////////////////////////////////////////////////////////////////////////// SOCKET.IO

let http = require('http').Server(express);
let io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('connected to socket');
  
  socket.on('disconnect', function(){
    console.log('disconnected from socked');
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {type:'new-message', text: message});    
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

                    // console.log(dataFrameParts);
                    // console.log(dataFrameValues);
                    
                    if (ilArray[itemIdStr] != null) { // element istnieje - stop i usun element
                        ilArray[itemIdStr].stop();
                        ilArray[itemIdStr] = null;
                        // let index = ilArray.indexOf(ilArray[itemIdStr]);
                        // if (index > -1) {
                        //     ilArray.splice(index, 1);
                        //     iFunc--;
                        // }
                    } else { // element nie istnieje dodaj nowy
                        iFunc++;
                        let il = new InfiniteLoop;
                        il.add(ilTestFunc, itemIdStr, iFunc);
                        il.setInterval(5 * 1000);
                        il.onError(function(error){
                            console.log(error);
                        });
                        il.run();

                        ilArray[itemIdStr] = il;
                        
                    }
                    



                    res.status(201).json({
                        message: 'Success',
                        obj: dataFrameValues
                    });

                });
        });
});


function ilTestFunc(t1, i) {    
    console.log(t1 + ' ' + i);
    io.emit('message', {type:'new-message', text: t1});
}

module.exports = router;