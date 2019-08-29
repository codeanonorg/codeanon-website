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

        if (typeof req.query['tag'] !== 'undefined') {
            const art_by_tag = articleQuery.getArticlByTag(req.query['tag']);

            let date_array = time.getDatesForArticleList(art_by_tag);

            res.render('blog.ejs', {
                username: user,
                article_list: art_by_tag,
                article_date_list: date_array,
                page: 'Blog'
            })
        } else if (typeof req.query['allArt'] !== 'undefined') {
            const all_art = articleQuery.getAllArticles();

            let date_array = time.getDatesForArticleList(all_art);

            res.render('blog.ejs', {
                username: user,
                article_list: all_art,
                article_date_list: date_array,
                page: 'blog',
            })
        } else {
            articleQuery
                .getTenMostRecentArticles()
                .then(queryResponse => {
                    console.log('articles : \n' + JSON.stringify(queryResponse.rows))

                    //let art_list = queryResponse.rows
                    let date_array = time.getDatesForArticleList(queryResponse.rows)

                    console.log(queryResponse.rows[0].tags)

                    res.render('blog.ejs', {
                        username: user,
                        article_list: queryResponse.rows,
                        article_date_list: date_array,
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