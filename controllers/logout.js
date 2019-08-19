exports.get = function (req, res) {
    req.session = null
    res.redirect('/login')
}