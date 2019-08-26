/**
 *
 *  "Article" route
 *
 */

const { Router } = require('express')
const articleRoute = Router()


const articleQuery = require('../public/js/articleQuerys')
//const formatDate = require('../public/js/dateHandling')

//const Article = require('../models/article.model')

articleRoute.get = async function (req, res) {

    let requestedId = req.params.ArticleId
    let articleContent = await articleQuery.getArticleById(requestedId)

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
}

module.exports = articleRoute