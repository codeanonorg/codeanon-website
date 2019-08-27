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

articleRoute.get('/', function (req, res) {

    /************
     * function that replaces `-` with ` ` (spaces)
     * then look in db for the article
     * and displays it
     */

     //Query 1 = take name and look for the article
     //Query 2 = get the username of the author from the user_id
     //Query 3 = get the articles_tags from the articles tags list


    //  /!\ BY ID
    userQuery.getArticleByName(nameOfTheArticle)
    

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
            res.redirect('/')
        })



    //      WIP       ***************//

    let requestedId = req.params.ArticleId
    let articleContent = articleQuery.getArticleById(requestedId)



    if (req.session.user) {

        let art_title = articleContent.title;
        let art_author = articleContent.author;

        // please do not modify this or you break the /blog page
        let art_date_msec = articleContent.date;
        // get the date in milliseconds

        let art_tags = articleContent.tags;
        let art_description = articleContent.description;
        let art_content = articleContent.content;

        // convert the date in readable format
        let date = new Date(art_date_msec);
        let art_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        res.render('article.ejs', {
            username: req.session.user.username,
            article_title: art_title,
            article_author: art_author,
            article_date: art_date,
            article_tags: [art_tags],
            article_description: art_description,
            article_content: art_content,
            page: 'Article'
        })
    } else {
        res.redirect('/')
    }
})

module.exports = articleRoute