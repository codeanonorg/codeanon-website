/**
 *
 *  "Blog" route
 *
 */

const { Router } = require('express')
const blogRoute = Router()


const articleQuery = require('../db/articleQuerys')
const time = require('../public/js/timeHandling')


blogRoute.get('/', function (req, res) {

    // check if connected
    if (req.session.user) {

        const user = req.session.user.username;

        if (typeof req.query.tags !== 'undefined') {
            // by tags

            let dateArray;
            let articleList;

            articleQuery
                .getArticlByTag(req.query.tags)
                .then(articles => {

                    if (articles.rows[0]) {

                        dateArray = time.getDatesForArticleList(articles.rows)
                        articleList = articles.rows

                    } else {
                        dateArray = []
                        articleList = []
                    }
                    res.render('blog.ejs', {
                        username: user,
                        article_list: articleList,
                        article_date_list: dateArray,
                        page: 'blog',
                    })
                })
                .catch(e => console.error(e))

        } else if (req.query.allArt === 'allArt') {

            // all articles

            articleQuery
                .getAllArticles()
                .then(articles => {

                    let dateArray = time.getDatesForArticleList(articles.rows);
                    res.render('blog.ejs', {
                        username: user,
                        article_list: articles.rows,
                        article_date_list: dateArray,
                        page: 'blog',
                    })
                })
                .catch(e => console.error(e))
        } else {
            articleQuery
                .getTenMostRecentArticles()
                .then(queryResponse => {

                    let dateArray = time.getDatesForArticleList(queryResponse.rows)

                    res.render('blog.ejs', {
                        username: user,
                        article_list: queryResponse.rows,
                        article_date_list: dateArray,
                        page: 'blog',
                    })
                })
                .catch(e => {
                    console.error(e.stack)
                    console.log('error')
                })
        }

    } else {
        res.redirect('/')
    }
})

module.exports = blogRoute
/*

tags
<% article_list[i].tags.forEach( item => {%>
    #<%= item  %>
    <% }) %>

    */