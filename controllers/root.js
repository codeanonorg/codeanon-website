exports.get = function (req, res) {
    if (req.session.user) {
        res.redirect('/home')
    } else {
        res.render('root.ejs')
    }
}