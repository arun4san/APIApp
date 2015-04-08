/**
 * Created by aruns on 7/4/15.
 */


var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

//{ born: { type: Date, required: '{PATH} is required!' }
// creating models
var productsSchema = new Schema({
    name: { type: String, required: 'Name is required!' },
    description: { type: String, required: 'description is required!' },
    price: { type: Number, required: 'Price is required!' }

});

module.exports = mongoose.model('products', productsSchema);