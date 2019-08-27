/**
 *
 *  "Article" route
 *
 */

const { Router } = require('express')
const articleRoute = Router()


const articleQuery = require('../db/articleQuerys')
const time = require('../public/js/timeHandling')

//const Article = require('../models/article.model')

articleRoute.get('/:articleId', function (req, res) {

    /************
     * function that replaces `-` with ` ` (spaces)
     * then look in db for the article
     * and displays it
     */

     //Query 1 = take name and look for the article
     //Query 2 = get the username of the author from the user_id
     //Query 3 = get the articles_tags from the articles tags list


    //  /!\ BY ID
    articleQuery
        .getArticleById(req.params.articleId)
        .then(article => {
            res.render('article.ejs', {
                username: req.session.user.username,
                article_title:          article.rows[0].title,
                article_author:         article.rows[0].user_id, // need to be resolved into the actual username QUERY
                article_date:           time.getDate(article.rows[0].timestamp),
                article_tags:           [article.rows[0].title], // need to be resolved into the id list /!\ QUERY
                article_description:    article.rows[0].description,
                article_content:        article.rows[0].content,
                page: 'Article'
            })
        })
        .catch(e => {
            console.error(e.stack)
            res.redirect('/blog')
        })
})

module.exports = articleRoute