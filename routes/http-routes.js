/**
 * Created by aruns on 01/4/15.
 */


var db = global.db;
var ObjectId = global.ObjectId;
var async = require('async');
var moment = require('moment');
var _ = require('underscore');
var products = require('../controllers/products.js');

var orders = require('../controllers/orders.js');
module.exports = function (app) {



    app.get('/', function(req,res){
        res.render('index', { title: 'Rest API App' });
    });


    app.post('/api/v1/products', products.createProduct);

    app.get('/api/v1/products', products.productList);

    app.put('/api/v1/products/:id',products.updateProduct);

    app.delete('/api/v1/products/:id',products.deleteProduct);


// Orders

    app.post('/api/v1/orders', orders.createOrder);

    app.get('/api/v1/orders', orders.orderList);

    app.put('/api/v1/orders/:id',orders.updateOrder);

    app.get('/api/v1/orders/today', orders.todayOrder);

    app.get('/api/v1/orders/thisWeek', orders.thisWeekOrder);

    app.get('/api/v1/orders/thisMonth', orders.thisMonthOrder);



}