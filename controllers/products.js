/**
 * Created by aruns on 7/4/15.
 */



var async = require('async');
var moment = require('moment');
var _ = require('underscore');
var Products = require('../models/products.js');


/* Products Operations*/

    //Create Product
module.exports.createProduct =  function(req,res){

        try {
            console.log("request................",req.body)
            var dataObj = {
                name : req.body.name,
                description :req.body.description,
                price : req.body.price

            }

            Products.find(dataObj ,function (err, doc) {

                if(doc && doc.length > 0){
                    var response = {
                        status:400 ,
                        data: "Product Already Created"
                    }
                    res.send(response)
                }else{

                    new Products(dataObj).save(function (err,result) {
                        var response = {
                            status: err ? 400 : 200,
                            data: err ? err : "Successfully created"
                        }
                        res.send(response)
                    })


                }

            })


        }catch (err){

            var response = {
                status :  400,
                data : "Error occurred in Crating Product "
            }

            res.send(response)
            console.log("error occurred in creating product.")
        }

    };

    //product update
module.exports.updateProduct =  function(req,res){
    console.log("error occurred in Updating product.",req.params.id)
        var dataObj = req.body;

        try {

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



            Products.findByIdAndUpdate(req.params.id, updateData, function (err, post) {
                var response = {
                    status: err ? 400 : 200,
                    data: err ? "Error occurred in Updating product." : "Successfully updated"
                }
                res.send(response)
            });

        }catch (err){
            console.log("error occurred in Updating product.")
        }

    };

    //Product delete
module.exports.deleteProduct = function(req,res){

        try{

            Products.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in removing Product" : "Successfully Removed "
                }
                res.send(response)
            });

        }catch (err){
            console.log("error occurred in deleting product.")
        }


    };

    //Product list
module.exports.productList = function(req,res){

        try{

            Products.find({} ,function (err, doc) {

                var response = {
                    status : err ? 400 : 200,
                    data : err ? "Error occurred in getting Product list" : doc
                }
                res.send(response)
            });

        }catch(err){

            console.log("error occurred in getting list of product.")
        }

 };

