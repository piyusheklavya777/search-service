const getResults = ({ query }) => {

    if (!query || [null, '', '\n'].includes(query))
        return []; 

}

module.exports = { getResults };