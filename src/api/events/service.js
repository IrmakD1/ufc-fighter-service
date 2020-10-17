const axios = require('axios')
const _ = require('lodash')

const key = process.env.API_KEY

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const sortFighterNames = (filteredList) => {
    const sortedNamesArray = _.map(filteredList, eventObject => {
        const lastNameRegex = /[^,]*/i
        const firstNameRegex = /[^,]*$/
        _.forEach(eventObject.competitors, competitor => {
            let string = competitor.name
            const firstName = string.match(firstNameRegex)
            const lastName = string.match(lastNameRegex)

            const noWhitespace = firstName[0].replace(/\s+/g, "")

            const fullName = `${noWhitespace} ${lastName}`

            competitor.name = fullName
        })

        return eventObject
    })

    return sortedNamesArray
}

const filterWeightClassName = (topLevelObject) => {
    const filteredWeightclass = _.map(topLevelObject, object => {
        const regex = /[^(]*/i

        let string = object.weightclass
        let shortName = string.match(regex)
        
        const weightClassName = shortName[0]

        const capitalizedWeightClass = capitalizeFirstLetter(weightClassName)

        let finalWeightClassName

        capitalizedWeightClass === 'Light_heavyweight' ? finalWeightClassName = 'Light Heavyweight' : finalWeightClassName = capitalizedWeightClass
        
        return {
            competitors: object.competitors,
            weightclass: finalWeightClassName
        }
    })

    return filteredWeightclass
}

const filterEvents = (data) => {
    const thisYear = new Date().getFullYear()

    const eventList = _.map(data.seasons, competition => {
        const eventYear = competition.start_date.substring(0,4)

        return parseInt(eventYear) === thisYear ? competition : null
    })

    return _.filter(eventList, events => events !== null)
}

const filterEventDetails = (data) => {
    const topLevelObject = _.compact(_.map(data.summaries, sportEvent => {
        return sportEvent.sport_event_status.status === "cancelled" ? 
            null : 
            { competitors: sportEvent.sport_event.competitors, weightclass: sportEvent.sport_event_status.weight_class }
    }))

    const filteredWeightclass = filterWeightClassName(topLevelObject)

    return sortFighterNames(filteredWeightclass)
}


const getEvents = async () => {

    const url = `http://api.sportradar.us/ufc/trial/v2/en/seasons.json?api_key=${key}`

    try {
        const { data } = await axios.get(url)

        const eventsThisYear = filterEvents(data)
    
        return eventsThisYear

    } catch (err) {
        return err
    }
}

const getEventDetails = async (seasonId) => {
    const url = `http://api.sportradar.us/ufc/trial/v2/en/seasons/${seasonId}/summaries.json?api_key=${key}`
 
    try {
        const { data } = await axios.get(url)

        const eventDetails = filterEventDetails(data)
    
        return eventDetails

    } catch (err) {
        return err
    }
}

module.exports = { getEvents, getEventDetails }