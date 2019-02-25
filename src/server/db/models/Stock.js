let mongoose = require('mongoose')

let stockSchema = new mongoose.Schema({
    date: String,
    symbol: String,
    open: Number,
    close: Number,
    low: Number,
    high: Number,
    volume: Number,
},{ collection : process.env.COLL_NAME || 'stocks'})

module.exports = mongoose.model('Stock', stockSchema)