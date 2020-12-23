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

module.exports = { getFighters }