/**
 *
 *  "Project" route
 *
 */

const { Router } = require('express')
const projectRoute = Router()

const projectQuery = require('../db/projectQuerys')

const time = require('../public/js/timeHandling')

projectRoute.get('/', function (req, res) {


    if (!req.session.user) res.redirect('/');

    if (req.query.tag) {

        console.log('tag')

        let dateArray;
        let projectList;

        projectQuery
            .getProjectByTag(req.query.tag)
            .then(projects => {

                if (projects.rows[0]) {

                    dateArray = time.getDatesForArticleList(projects)
                    projectList = projects.rows

                } else {
                    dateArray = []
                    projectList = []
                }
                res.render('projectHub.ejs', {
                    username: req.session.user.username,
                    project_list: projectList,
                    project_date_list: dateArray,
                    page: 'Project Hub',
                })
            })
            .catch(e => console.error(e))
    } else if (req.query.allArt === 'allArt') {
        console.log('all art')

        let dateArray;
        let projectList;


        projectQuery
            .getAllProjects()
            .then(projects => {

                if (projects.rows[0]) {

                    dateArray = time.getDatesForArticleList(projects)
                    projectList = projects.rows

                } else {
                    dateArray = []
                    projectList = []
                }

                res.render('projectHub.ejs', {
                    username: req.session.user.username,
                    project_list: projectList,
                    project_date_list: dateArray,
                    page: 'Project Hub',
                })
            })
            .catch(e => console.error(e))
    } else {
        projectQuery
            .getTenMostRecentProjects()
            .then(queryResponse => {

                let date_array = time.getDatesForArticleList(queryResponse.rows)

                res.render('projectHub.ejs', {
                    username: req.session.user.username,
                    project_list: queryResponse.rows,
                    project_date_list: date_array,
                    page: 'ProjectHub',
                })
            })
            .catch(e => {
                console.error(e.stack)
                console.log('error')
            })
    }
})



projectRoute.get('/:projectId', function (req, res) {
    projectQuery
        .getProjectById(req.params.projectId)
        .then(project => {
            if (project.rows[0]) {
                res.render('project.ejs', {

                    //  add project github link
                    //  need to modify database

                    username: req.session.user.username,
                    project_title: project.rows[0].title,
                    project_author: project.rows[0].username, // need to be resolved into the actual username QUERY
                    project_date: time.getDate(project.rows[0].timestamp),
                    project_tags: project.rows[0].tags, // need to be resolved into the id list /!\ QUERY
                    project_description: project.rows[0].description,
                    project_content: project.rows[0].content,
                    page: 'Article'
                })
            } else {
                res.redirect('/project')
            }
        })
        .catch(e => {
            console.error(e.stack)
            res.redirect('/project')
        })

})


module.exports = projectRoute