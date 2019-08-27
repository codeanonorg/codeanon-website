

module.exports = {
    getDatesForArticleList: function (article_list) {
        let date_array = [];

        article_list.forEach(element => {

            let Qdate = new Date(parseInt(element.timestamp, 10))
            date_array.push(Qdate.getDate() + "/" + (Qdate.getMonth() + 1) + "/" + Qdate.getFullYear())
        })
        return date_array
    },

    getDate: function (timestampInMsec) {
        let date = new Date(timestampInMsec);
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    },

    newTime: function () {
        let date = new Date();
        return date.getTime();
    }
}