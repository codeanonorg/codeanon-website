
module.exports = function (article_list) {
    let date_array = [];
    article_list.forEach(element => {
        let date = new Date(element.article_date)
        date_array.push(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear())
    });
    return date_array    
};