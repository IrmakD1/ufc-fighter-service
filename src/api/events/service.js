const _ = require('lodash')
const Boom = require('@hapi/boom');

const logger = require('../../../server/logger')
const store = require('../../store')
const filterData = require('../../filterData')

const getEvents = async (db, collection) => {
    logger().info('Getting events from Db')
    try {
        const res = await store.getAllEvents(db, collection)
        return res
    } catch (err) {     
        throw Boom.badData(`Unable to get events from db: ${err}`);
    }
}

const getSingleEventDetails = async (db, eventId, collection) => {
    logger().info('Getting event from Db')
    try {
        const res = await store.getSingleEvent(db, eventId, collection)
        const eventDetails = filterData.eventDetails(res)

        return eventDetails

    } catch (err) {
        throw Boom.badData(`Unable to get event from db: ${err}`);
    }
}


module.exports = {
    getEvents,
    getSingleEventDetails
}