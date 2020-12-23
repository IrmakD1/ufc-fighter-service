const _ = require('lodash')

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

const eventDetails = (data) => {
    const topLevelObject = _.compact(_.map(data.summaries, sportEvent => {
        return sportEvent.sport_event_status.status === "cancelled" ? 
            null : 
            { competitors: sportEvent.sport_event.competitors, weightclass: sportEvent.sport_event_status.weight_class }
    }))

    const filteredWeightclass = filterWeightClassName(topLevelObject)

    return sortFighterNames(filteredWeightclass)
}

module.exports = eventDetails