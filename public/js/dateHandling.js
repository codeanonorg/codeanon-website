module.export = {
    // format the correct date ouput from a list of articles
    formatDate: function (article_list) {
        let date_array = []
        for (let i = 0; i < article_list.length; i++) { // make it a function
            let date = new Date(article_list[i].article_date)
            date_array.push(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear());
        }
        return date_array
    }
}