/**
 * Created by aruns on 01/4/15.
 */


var db = global.db;
var ObjectId = global.ObjectId;
var async = require('async');
var moment = require('moment');
var _ = require('underscore');

module.exports = function (app) {

    app.get('/', function(req,res){
        res.render('index', { title: 'Rest API App' });
    });


    /* Products Operations*/

    //Create Product
    app.post('/products/create', function(req,res){

        try {
            console.log("request................",req.body)
            var dataObj = {
                name : req.body.name,
                description :req.body.description,
                price : req.body.price

            }

            db.products.save(dataObj, function (err, doc) {

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in Crating Product" : "Successfully created "
                }
                res.send(response)
            });

        }catch (err){
            console.log("error occurred in creating product.")
        }

    });

    //product update
    app.post('/products/update', function(req,res){

        var dataObj = req.body;

        try {
                var updateObj = {
                    _id: ObjectId(dataObj.product)
                };

                var updateData = {}

                if(dataObj && dataObj.name && dataObj.name != "" ){
                    updateData.name = dataObj.name
                }

                if(dataObj && dataObj.name && dataObj.name != "" ){
                    updateData.description = dataObj.description
                }

                if(dataObj && dataObj.name && dataObj.name != "" ){
                    updateData.price = dataObj.price
                }

                var setter = {
                    $set: updateData
                }

                db.products.update(updateObj, setter, false, function (err, update) {

                    var response = {
                        status: err ? 400 : 200,
                        data: err ? "Error occurred in Updating product." : "Successfully updated"
                    }
                    res.send(response)

                })
        }catch (err){
            console.log("error occurred in Updating product.")
        }

    });

    //Product delete
    app.post('/products/delete', function(req,res){

        console.log("request.....delete...........",req.body)

        try{

            var dataObj = {
                _id : ObjectId(req.body.product)
            }

            db.products.remove(dataObj, function (err, doc) {

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in removing Product" : "Successfully Removed "
                }
                res.send(response)
            });

        }catch (err){
            console.log("error occurred in deleting product.")
        }


    });

    //Product list
    app.get('/products/list', function(req,res){

        try{

            db.products.find({},{}).toArray( function (err, doc) {

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in getting Product list" : doc
                }
                res.send(response)
            });

        }catch(err){

            console.log("error occurred in getting list of product.")
        }

    });


    var getAsObjectIds = function(list, cb){
        var objects = [];

        var iterator = function(listItem, iterator_cb){
            try{
                if(listItem){
                    objects.push(ObjectId(listItem))
                    iterator_cb(null);
                } else{
                    iterator_cb('INVALID_DB_OBJECT');
                }
            }catch (e){
                cb("INVALID_DB_OBJECT");
            }

        }

        async.forEach(list || [], iterator, function(err){
            err ? cb(err, null) : cb(null, objects);
        });

    };


    /* Orders Operations*/

    //Create Orders
    app.post('/orders/create', function(req,res){

        try {
            // defining variables
            var totalValue = 0;
            var productArray = [];
            var matchObj = {}
            console.log("request................",req.body)

            if(req.body.product && req.body.product.length > 0 ){
                getAsObjectIds(req.body.product,function(err,res){
                    matchObj._id = {$in : res}
                })}


            db.products.find(matchObj,{}).toArray( function (err, products) {

                async.eachSeries(products || [], function(product, productCB) {
                    totalValue = totalValue+product.price
                    productArray.push(product)
                    productCB(null)

                },function(err){

                    var orderObj = {
                        //product : matchObj._id['$in'],
                        totalValue : totalValue,
                        products : productArray ,
                        isCompleted : req.body.isCompleted,
                        day : moment().startOf('day')._d,
                        week : moment().startOf('week')._d,
                        month : moment().startOf('month')._d
                    }
                    db.orders.save(orderObj, function (err, doc) {

                        var response = {
                            status : err ? 400 : 200,
                            data : err ? "Error occurred in Crating Order" : "Successfully Order "
                        }
                        res.send(response)
                    });

                    //console.log("products..........",totalValue)
                })

            });

        }catch (err){
            console.log("error occurred in creating Order.")
        }

    });




    //Orders list
    app.get('/orders/list', function(req,res){

        try{

            db.orders.find({},{"products._id":0,day:0,month:0,week:0}).toArray( function (err, doc) {

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in getting Order list" : doc
                }
                res.send(response)
            });

        }catch(err){

            console.log("error occurred in getting list of orders.")
        }

    });

    // update order

    app.post('/orders/update', function(req,res){

        var dataObj = req.body;

        try {
            var updateObj = {
                _id: ObjectId(dataObj.order)
            };

            var updateData = {}

            if(dataObj && dataObj.isCompleted && dataObj.isCompleted != "" ){
                updateData.isCompleted = dataObj.isCompleted
            }

            var setter = {
                $set: updateData
            }

            db.orders.update(updateObj, setter, false, function (err, update) {

                var response = {
                    status: err ? 400 : 200,
                    data: err ? "Error occurred in Updating Order." : "Successfully updated"
                }
                res.send(response)

            })
        }catch (err){
            console.log("error occurred in Updating order.")
        }

    });

    // today orders

    app.get('/orders/today', function(req,res){

        try{

            var todayObj = {

                day : moment().startOf('day')._d

            }

            db.orders.find(todayObj,{"products._id":0,day:0,month:0,week:0}).toArray( function (err, doc) {

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in getting Order list" : doc
                }
                res.send(response)
            });

        }catch(err){

            console.log("error occurred in getting list of orders.")
        }

    });

    // this week orders
    app.get('/orders/thisWeek', function(req,res){

        try{

            var todayObj = {

                week : moment().startOf('week')._d

            }

            db.orders.find(todayObj,{"products._id":0,day:0,month:0,week:0}).toArray( function (err, doc) {

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in getting Order list" : doc
                }
                res.send(response)
            });

        }catch(err){

            console.log("error occurred in getting list of orders.")
        }

    });


    // this month orders

    app.get('/orders/thisMonth', function(req,res){

        try{

            var todayObj = {

                month : moment().startOf('month')._d

            }

            db.orders.find(todayObj,{"products._id":0,day:0,month:0,week:0}).toArray( function (err, doc) {

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in getting Order list" : doc
                }
                res.send(response)
            });

        }catch(err){

            console.log("error occurred in getting list of orders.")
        }

    });




}