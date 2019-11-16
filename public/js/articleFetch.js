const getUsers = async () => {

    let res = await fetch('/api/articles/top3')
    if (res.ok) {
        let fullList = await res.json();
        console.log(fullList);
        displayArticleOnDom(fullList);
    } else {
        console.error('Retour du serveur: ', res.status);
    }
}
getUsers();

function displayArticleOnDom(fullList) {
    window.onload = () => {
        for (let i = 0; i < 3; i++) {
            const element = document.querySelector("#articles");

            let tagString;
            if (fullList.article_list[i].tags) {
                article_list[i].tags.forEach(item => {
                    tagString += ("#" + item);
                })
            }

            element.appendChild(`<a href="/article/${fullList.article_list[i].article_id}">
        <section class="card">
            <header>
                <h3> ${fullList.article_list[i].title} </h3>
                <h3>
                    <object data="user.svg" type="image/svg+xml">
                        <img src="/public/user.svg" alt="">
                    </object>
                    <span> ${fullList.article_list[i].username} </span> | ${fullList.article_date_list[i]} %>
                </h3>
                
                <p>
                    ${fullList.article_list[i].description.slice(0, 120)}
                </p>
                <p>
                    ${tagString}
                </p>
            </header>
        </section>
    </a>
    `)
        }
    }
}