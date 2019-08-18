const router = require('express').Router()
const articleQuery = require('../public/js/articleQuerys')
const formatDate = require('../public/js/dateHandling')

/* GET blog page */
router.get('/', async (req, res) => {
    if (req.session.user) {
        const user = req.session.user.username;

        if (typeof req.query['tag'] !== 'undefined') {
            const art_by_tag = await articleQuery.getArticlByTag(req.query['tag']);

            let date_array = formatDate(art_by_tag);

            res.render('project.ejs', {
                username: user,
                article_list: art_by_tag,
                article_date_list: date_array,
                page: 'Project'
            })
        } else if (typeof req.query['allArt'] !== 'undefined') {
            const all_art = await articleQuery.getAllArticles();

            let date_array = formatDate(all_art);

            res.render('project.ejs', {
                username: user,
                article_list: all_art,
                article_date_list: date_array,
                page: 'Project',
            })
        } else {
            let art_list = await articleQuery.getTenMostRecentArticles();
            // get 9 last submited articles
            let date_array = formatDate(art_list);

            res.render('Project.ejs', {
                username: user,
                article_list: art_list,
                article_date_list: date_array,
                page: 'Project',
            })
        }

    } else {
        res.redirect('/')
    }
})

module.exports = router