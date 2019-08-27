

module.exports = {
    getDatesForArticleList: function (articleList) {
        let date_array = [];


        article_list.forEach(element => {

            let Qdate = new Date(element.date)
            date_array.push(Qdate.getDate() + "/" + (Qdate.getMonth() + 1) + "/" + Qdate.getFullYear())
        })
        return date_array
    },

    getDate: function (timestampInMsec) {
        let date = new Date(art_date_msec);
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    },

    newTime: function () {
        let date = new Date();
        return date.getTime();
    }
}