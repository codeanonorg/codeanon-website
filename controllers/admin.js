exports.get = function (req, res) {
    if (req.session.user) {
        res.render('admin.ejs', {
            username: req.session.user.username,
            page: "Admin"
        })
    } else {
        res.redirect('/')
    }
}