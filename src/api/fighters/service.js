const axios = require('axios')
const _ = require('lodash')

const fighterIndex = require('../../data/fighterIndex')

const key = process.env.API_KEY

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

const sortRecord = ({wins, draws, losses}) => {
    return `W: ${wins}, D: ${draws}, L: ${losses}`
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
        
        const result = average(value)
        newObject[`${key}`] = [result]
    })

    return newObject

}

const sortfighterDetails = (data) => {
    let fighterOne
    let fighterTwo

    fighterOne = {
        name: sortName(data[0].competitor.name),
        nationality: data[0].info.birth_country, 
        fightingOutOf: data[0].info.fighting_out_of_city,
        record: sortRecord(data[0].record),
    }

    fighterTwo = {
        name: sortName(data[2].competitor.name),
        nationality: data[2].info.birth_country, 
        fightingOutOf: data[2].info.fighting_out_of_city,
        record: sortRecord(data[2].record),
    }

    const fighterOneStats = sortStats(data[1].summaries, data[0].competitor.id)
    const fighterTwoStats = sortStats(data[3].summaries, data[2].competitor.id)

    const fighterOneFinalStats = findAverage(fighterOneStats)
    const fighterTwoFinalStats = findAverage(fighterTwoStats)

    fighterOne = {
        ...fighterOne,
        ...fighterOneFinalStats
    }

    fighterTwo = {
        ...fighterTwo,
        ...fighterTwoFinalStats
    }
    

    return ({ fighterOne, fighterTwo })
} 


const getFighter = async (name) => {
    const fighter = _.filter(fighterIndex, fighter => fighter.name === name)

    const url = `http://api.sportradar.us/ufc/trial/v2/en/competitors/sr:competitor:${fighter[0].id}/profile.json?api_key=${key}`

    const { data } = await axios.get(url)

    return data
}

const wait = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

const makeCalls = async (urls) => {
    const dataArray = []
    for (const url of urls) {
        const { data } = await axios.get(url)
        await wait(1001)

        dataArray.push(data)
    }

    return dataArray
}

//Can I rewrite this to be more efficient?
const getFighters = async (fighterOneId, fighterTwoId) => {
    const firstFighterRecordUrl = `http://api.sportradar.us/ufc/trial/v2/en/competitors/${fighterOneId}/profile.json?api_key=${key}`

    const firstFighterDetailsUrl = `http://api.sportradar.us/ufc/trial/v2/en/competitors/${fighterOneId}/summaries.json?api_key=${key}`

    const secondFighterRecordUrl = `http://api.sportradar.us/ufc/trial/v2/en/competitors/${fighterTwoId}/profile.json?api_key=${key}`
    
    const secondFighterDetailsUrl = `http://api.sportradar.us/ufc/trial/v2/en/competitors/${fighterTwoId}/summaries.json?api_key=${key}`

    const urls = [firstFighterRecordUrl, firstFighterDetailsUrl, secondFighterRecordUrl, secondFighterDetailsUrl]


    try {
        
        const data = await makeCalls(urls)

        const fighterDetails = sortfighterDetails(data)
    
        return fighterDetails
        
    } catch(err) {
        console.log(err);
    }

}


module.exports = { getFighter, getFighters }