import { MongoClient } from "mongodb";

function login(usernamePara, passwordPara) {
    let logTest = false;

        (async () => {
            let client = await mongo.connect(databaseUrl,
                { useNewUrlParser: true });

            let db = await client.db("CodeAnonDatabase");
            try {
                const res = await db.collection("users").findOne({ username: usernamePara });

                if (res === null) {
                    logTest = false;
                } else if (res.username === usernamePara && res.hashedPassword === passwordPara) {
                    console.log("login and username ok");
                    logTest = true;
                } else {
                    logTest = false;
                }
                console.log("still here");
                console.log(res)
            }
            finally {
                client.close();
            }
        })()
        .catch(err => console.error(err));

    return logTest;
}

/////////////////////////////////////
function auth(username, password) { // auth function
    let ok = false;
    for (let u of users) {
        // CHANGE WITH USERNAME
        if (u.username === username && u.password === password) {  // simplifie to remove let ok = ...
            ok = true
            break;
        }
    }
    return ok
}