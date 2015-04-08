/**
 * Created by aruns on 7/4/15.
 */
var moment = require('moment');
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

var ordersSchema = new Schema({
    totalValue: Number,
    products: { type: [], required: 'Product is required!' },
    isCompleted: { type: Boolean, required: 'isCompleted is required!' },
    date : { type: Date, default: moment().toDate() }

});

module.exports = mongoose.model('orders', ordersSchema);
