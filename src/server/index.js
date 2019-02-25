const express = require('express');
const database = require('./db/Database')
const StockModel = require('./db/models/Stock')
const {responseHanlder, asyncMiddleware} = require('./middlewares')

const app = express();

app.use(express.static('dist'));

let api = {
    getAllStocks: async(req, res) => {
        let {index, size, symbol} = req.query
        index = Number(index)
        size = Number(size)
        let skip = index * size

        let data = [], count = 0;
        if(symbol) {
            count = await StockModel.count({symbol})
            data = await StockModel.find({symbol}).limit(size).skip(skip)
        } else {
            count = await StockModel.count()
            data = await StockModel.find({}).limit(size).skip(skip)
        }
        return {count, data}
    },
    bestStock: async(req, res) => {
        return await StockModel.find().sort({high:-1}).limit(3)
    },
    getStocksForSymbol: async(req, res) => {
        let {symbol} = req.params
        return await StockModel.find({symbol})
    }
}

app.get('/api/stock', asyncMiddleware(api.getAllStocks));
app.get('/api/stock/:symbol', asyncMiddleware(api.getStocksForSymbol));
app.get('/api/bestStock', asyncMiddleware(api.bestStock));

app.use(responseHanlder)

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
