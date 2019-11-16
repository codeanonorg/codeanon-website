window.onload = () => {
    const getUsers = async () => {

        let res = await fetch('/api/articles/top3')
        if (res.ok) {
            let fullList = await res.json();
            //  console.log(fullList);
            await displayArticleOnDom(fullList);
        } else {
            console.error('Retour du serveur: ', res.status);
        }
    }
    getUsers();

    async function displayArticleOnDom(fullList) {
        let maxLoops;
        if (fullList.length < 3) {
            maxLoops = fullList.length
        } else {
            maxLoops = 3;
        }
        
        for (let i = 0; i < maxLoops; i++) {
            const element = document.querySelector("#articles");

            let tagString = '# ';

            
            if (fullList[i].tags.length > 1) {
                for (let index = 0; index < fullList[i].tags.length; index++) {
                    console.log(fullList[i].tags[0])
                    tagString.concat('# ', fullList[i].tags[index])
                    
                }
            } else if (fullList[i].tags) {
                tagString = fullList[i].tags
            }
            
            //  console.log(i + ' ' + tagString)

            element.insertAdjacentHTML("afterend", `<a href="/article/${fullList[i].article_id}">
        <section class="card">
            <header>
                <h3> ${fullList[i].title} </h3>
                <h3>
                    <object data="user.svg" type="image/svg+xml">
                        <img src="/public/user.svg" alt="">
                    </object>
                    <span> ${fullList[i].username} </span> | ${fullList[i].date}
                </h3>
                
                <p>
                    ${fullList[i].description.slice(0, 120)}
                </p>
                <p>
                    ${tagString}
                </p>
            </header>
        </section>
    </a>
    `)
            //}
        }
    }

}