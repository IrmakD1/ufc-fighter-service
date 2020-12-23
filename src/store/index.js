const connectDb = require('./connect-db')
const { getAllEvents, getSingleEvent } = require('./events')
const { getFighterDetails } = require('./fighters')

module.exports = {
    connectDb,
    getAllEvents, 
    getSingleEvent,
    getFighterDetails
}