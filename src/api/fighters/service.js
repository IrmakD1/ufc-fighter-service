const _ = require('lodash')

const store = require('../../store')
const filterData = require('../../filterData')

const getFighterDetails = async (fighter1Id, fighter2Id, db) => {
    const fighter1Record = await store.getFighterDetails(fighter1Id, db, 'Fighter Records')
    const fighter1Details = await store.getFighterDetails(fighter1Id, db, 'Fighter Details')
    const fighterOneDetails = {...fighter1Record, ...fighter1Details}

    const fighter2Record = await store.getFighterDetails(fighter2Id, db, 'Fighter Records')
    const fighter2Details = await store.getFighterDetails(fighter2Id, db, 'Fighter Details')
    const fighterTwoDetails = {...fighter2Record, ...fighter2Details}

    const fighterOne = filterData.fighterDetails(fighterOneDetails)
    const fighterTwo = filterData.fighterDetails(fighterTwoDetails)

    return ({ fighterOne, fighterTwo })
}


const getFighters = async (fighterOneId, fighterTwoId, db) => {
    const fighterDetails = await getFighterDetails(fighterOneId, fighterTwoId, db)
    return fighterDetails 
}

const sortFightersByRank = (fighters) => {
    let rankingList = []
    if( fighters.length <= 1) {
        throw Error('not enough fighters in the weightclass')
    }
    _.forEach(fighters, fighter => {
        if(fighter.rank === 'Champion') {
            rankingList[0] = fighter
        } else {
            rankingList[fighter.rank] = fighter
        }
    })

    return rankingList
}


const getWeightClassFighters = async (weight, db) => {
    const allRankedFighters = await store.getAllRankedFighters(db)
    const fightersFromWeightClass = filterData.getWeightClassFighters(weight, allRankedFighters)
    const sortedFighters = _.map(fightersFromWeightClass, fighter => {

        const fighterObj = filterData.fighterDetails({ ...fighter.record, ...fighter.details })

        return ({ ...fighterObj, rank: fighter.rank, weightclass: fighter.weightclass })
    })
    
    return sortFightersByRank(sortedFighters)
} 

module.exports = { getFighters, getWeightClassFighters }