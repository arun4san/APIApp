/**
 * Created by aruns on 7/4/15.
 */

var async = require('async');
var moment = require('moment');
var _ = require('underscore');
var Orders = require('../models/orders.js');
var Products = require('../models/products.js');

var getAsObjectIds = function(list, cb){
    var objects = [];

    var iterator = function(listItem, iterator_cb){
        try{
            if(listItem){
                objects.push(listItem)
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
    var createOrder =  function(req,res){

    try {
        // defining variables
        var totalValue = 0;
        var productArray = [];
        var matchObj = {}

        if(req.body.product && req.body.product != 'undefined'){

            if(req.body.product && req.body.product.length > 0 ){
                getAsObjectIds(req.body.product,function(err,res){

                    matchObj._id = {$in : res}
                })}

            //console.log("request................",matchObj)
            Products.find(matchObj, function (err, products) {
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
                        date : moment().startOf('day')._d

                    }
                    new Orders(orderObj).save(function (err,result) {
                        var response = {
                            status: err ? 400 : 200,
                            data: err ? err : "Successfully created"
                        }
                        res.send(response)
                    })

                })

            });


        }else{


            var response = {
                status:  400 ,
                data:  "Product is required"
            }
            res.send(response)
        }


    }catch (err){
        console.log("error occurred in creating Order.")
    }

};




//Orders list
var orderList =  function(req,res){

    try{

        Orders.find({},{"products._id":0},function (err, doc) {

            var response = {
                status : err ? 400 : 200,
                data : err ? "Error occurred in getting Order list" : doc
            }
            res.send(response)
        });

    }catch(err){

        console.log("error occurred in getting list of orders.")
    }

};

// update order

var updateOrder =  function(req,res){

    var dataObj = req.body;

    try {

        var updateData = {}

        if(dataObj && dataObj.isCompleted && dataObj.isCompleted != "" ){
            updateData.isCompleted = dataObj.isCompleted
        }

        Orders.findByIdAndUpdate(req.params.id, updateData, function (err, post) {
            var response = {
                status: err ? 400 : 200,
                data: err ? "Error occurred in Updating product." : "Successfully updated"
            }
            res.send(response)
        });
    }catch (err){
        console.log("error occurred in Updating order.")
    }

};

// today orders

var todayOrder = function(req,res){


    var summary = {

        "summary":{
            sum : 0,
            total : 0
        }
    };
    var totalValue = 0;
    try{

        var todayObj = {

            date : moment().startOf('day')._d

        }

        Orders.find(todayObj,{"products._id":0,"__v":0}, function (err, doc) {

            summary["summary"].total = doc.length;
            async.eachSeries(doc || [], function(order, orderCB) {

                totalValue = totalValue+order.totalValue
                orderCB(null)

            },function(err){
                summary["summary"].sum = totalValue
               var resturnJson =  doc.push(summary);

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in getting Order list" : doc
                }
                res.send(response)
            })

        });

    }catch(err){

        console.log("error occurred in getting list of orders.")
    }

};

// this week orders
var thisWeekOrder = function(req,res){

    var summary = {};
    var totalValue = 0;
    try{

        var todayObj = {

            date : {$gte : moment().startOf('week')._d , $lte : moment().endOf('week')._d}

        }

        var summary = {

            "summary":{
                sum : 0,
                total : 0
            }
        };

        Orders.find(todayObj,{"products._id":0,"__v":0}, function (err, doc) {

            summary["summary"].total = doc.length;
            async.eachSeries(doc || [], function(order, orderCB) {

                totalValue = totalValue+order.totalValue
                orderCB(null)

            },function(err){
                summary["summary"].sum = totalValue
                var resturnJson =  doc.push(summary);

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in getting Order list" : doc
                }
                res.send(response)
            })

        });

        }catch(err){

            console.log("error occurred in getting list of orders.")
        }

};


// this month orders

var thisMonthOrder =  function(req,res){

    var summary = {};
    var totalValue = 0;
    try{

        var todayObj = {

            date : {$gte : moment().startOf('month')._d , $lte : moment().endOf('month')._d}

        }

        var summary = {

            "summary":{
                sum : 0,
                total : 0
            }
        };

        Orders.find(todayObj,{"products._id":0,"__v":0}, function (err, doc) {

            summary["summary"].total = doc.length;
            async.eachSeries(doc || [], function(order, orderCB) {

                totalValue = totalValue+order.totalValue
                orderCB(null)

            },function(err){
                summary["summary"].sum = totalValue
                var resturnJson =  doc.push(summary);

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in getting Order list" : doc
                }
                res.send(response)
            })

        });

    }catch(err){

        console.log("error occurred in getting list of orders.")
    }

};


module.exports = {

    createOrder : createOrder,
    orderList : orderList ,
    updateOrder : updateOrder,
    thisMonthOrder : thisMonthOrder,
    thisWeekOrder : thisWeekOrder,
    todayOrder: todayOrder
}