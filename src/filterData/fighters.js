const _ = require('lodash')

const sortName = (name) => {
    const lastNameRegex = /[^,]*/i
    const firstNameRegex = /[^,]*$/

    let string = name
    const firstName = string.match(firstNameRegex)
    const lastName = string.match(lastNameRegex)

    const noWhitespace = firstName[0].replace(/\s+/g, "")

    const fullName = `${noWhitespace} ${lastName}`

    return fullName
}

const sortStats = (summaries, id) => {
    let totalStrikesPercentage = []
    let siginificantStrikePercentage = []
    let knockdowns = []
    let takedownPercentage = []

    _.forEach(summaries, sportEvent => {
        if(sportEvent.statistics !== undefined) {
            _.forEach(sportEvent.statistics.totals.competitors, competitor => {
                if(competitor.id === id) {
                    totalStrikesPercentage.push(competitor.statistics.total_strike_percentage)
                    siginificantStrikePercentage.push(competitor.statistics.significant_strike_percentage)
                    knockdowns.push(competitor.statistics.knockdowns)
                    takedownPercentage.push(competitor.statistics.takedowns)
                }
            })
        }  
    })
    return ({ totalStrikesPercentage, siginificantStrikePercentage, knockdowns, takedownPercentage })
}

const findAverage = (statsObject) => {

    let newObject = statsObject

    const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

    _.forEach(newObject, (value, key) => {
        if (value.length === 0 ) value.push(0)
        
        const averageNum = average(value)
        const roundedNum = Math.round((averageNum + Number.EPSILON) * 100) / 100
        newObject[`${key}`] = [roundedNum]
    })

    return newObject

}

const fighterDetails = (fighterDetails) => {
    let fighter 

    fighter = {
        name: sortName(fighterDetails.competitor.name),
        nationality: fighterDetails.info.birth_country !== undefined ? fighterDetails.info.birth_country : 'UNKOWN', 
        fightingOutOf: fighterDetails.info.fighting_out_of_city !== undefined ? fighterDetails.info.fighting_out_of_city : 'UNKOWN',
        record: fighterDetails.record,
        competitor_id: fighterDetails.competitor_id
    }

    const fighterStats = sortStats(fighterDetails.summaries, fighterDetails.competitor_id)
    const finalFighterStats = findAverage(fighterStats)

    return({ ...fighter, ...finalFighterStats})
}

module.exports = fighterDetails