/**
 *
 *  "Blog" route
 *
 */

const { Router } = require('express')
const blogRoute = Router()


const articleQuery = require('../public/js/articleQuerys')
const formatDate = require('../public/js/dateHandling')


blogRoute.get(async function (req, res) {
    if (req.session.user) {
        const user = req.session.user.username;

        if (typeof req.query['tag'] !== 'undefined') {
            const art_by_tag = await articleQuery.getArticlByTag(req.query['tag']);

            let date_array = formatDate.getDate(art_by_tag);

            res.render('blog.ejs', {
                username: user,
                article_list: art_by_tag,
                article_date_list: date_array,
                page: 'Blog'
            })
        } else if (typeof req.query['allArt'] !== 'undefined') {
            const all_art = await articleQuery.getAllArticles();

            let date_array = formatDate.getDate(all_art);

            res.render('blog.ejs', {
                username: user,
                article_list: all_art,
                article_date_list: date_array,
                page: 'blog',
            })
        } else {
            let art_list = []
            let query = articleQuery.getTenMostRecentArticles(function (err, blogs) {
                if (err) {
                    return                    
                }
                art_list.push(blogs)            
            })//.toArray();
            console.log(art_list)
            // get 9 last submited articles
            let date_array = formatDate.getDate(art_list);

            res.render('blog.ejs', {
                username: user,
                article_list: art_list,
                article_date_list: date_array,
                page: 'blog',
            })
        }

    } else {
        res.redirect('/')
    }
})

module.exports = blogRoute