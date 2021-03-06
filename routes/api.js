/**
 *
 *  "API" route
 *
 */

const { Router } = require('express')
const apiRoute = Router()


const articleQuery = require('../db/articleQuerys')
const time = require('../public/js/timeHandling')


apiRoute.get('/articles/top3', function (req, res) {
    
    articleQuery.getTenMostRecentArticles()
    .then(queryResponse => {
        let dateArray = time.getDatesForArticleList(queryResponse.rows)

        for (let i = 0; i < queryResponse.rows.length; i++) {
            queryResponse.rows[i].date = dateArray[i]
        }
        //  console.log(queryResponse.rows)
        res.status(200).json(queryResponse.rows)

        })
        .catch(e => {
            console.error(e.stack)
            console.log('error')
        })
    
    /*
    res.status(200).send({
        name: 'testUser'
    })*/
})

module.exports = apiRoute