const _ = require('lodash')

const getWeightClassFighters = (weight, allRankedFighters) => {
    let Weight = weight === 'Light_Heavyweight' ? 'Light Heavyweight' : weight
    const fighters = _.filter(allRankedFighters, fighter => fighter.weightclass === Weight)
    return fighters
}

module.exports = getWeightClassFighters