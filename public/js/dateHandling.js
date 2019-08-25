


/*
module.exports = {
    getDate:*/
function getDate(article_list) {

    let date_array = [];
    //console.log(article_list)

    article_list.forEach(element => {

        let Qdate = new Date(element.date)
        date_array.push(Qdate.getDate() + "/" + (Qdate.getMonth() + 1) + "/" + Qdate.getFullYear())
    })
    return date_array
}

//}

module.exports.getDate = getDate