/**
 *
 *  "Article" route
 *
 */

const { Router } = require('express')
const articleRoute = Router()


const articleQuery = require('../db/articleQuerys')
const userQuery = require('../db/userQuerys')
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
                article_author:         article.rows[0].username, // need to be resolved into the actual username QUERY
                article_date:           time.getDate(article.rows[0].timestamp),
                article_tags:           article.rows[0].tags, // need to be resolved into the id list /!\ QUERY
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

articleRoute.get('/:articleId/delete', (req, res) => {
    userQuery
        .getUserByUsername(req.session.user.username)
        .then(queryResponse => {

            if (queryResponse.role_id !== 1) {

                res.redirect('/home')

            } else {
                return articleQuery.deleteArticleById(req.params.articleId)
            }
        }).then(queryResponse => {
            console.log('Article Deleted Successfully')
            res.redirect('/admin/unverifiedArticles')
        })
        .catch(e => console.error(e))

})

module.exports = articleRoute