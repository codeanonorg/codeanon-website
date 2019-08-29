# Site CODEANON

## Pour les devs

* Veillez a installer Postgresql pour pouvoir se connecter au site
* [Postgresql server](https://www.postgresql.org/download/)
* Puis créer une base de données appellée ```catest```, les paramètres de connexion figures dans le fichier ```db/pool.js```

1. Pour installer les dépendances :

```$ npm install```

2. Pour créer les tables dans la base de données postgre:

```$ node initDb.js```

3. Pour créer le compte admin

```$ node createAdmin.js```

4. Pour créer l'article de test:

```$ node createTestArticle.js```

5. Pour lancer le site

```$ node index.js```

6. Pour essayer le site :

[cliquer ici](http://127.0.0.1:8080)

*Attention, vous devez d'abord lancer le serveur en local !!*

### P.-S. Fonctionnement de l'architecture MVC

* MVC = Model View Controller

* ```/routes/exemple.routes.js``` gère les methodes (get, post, put, delete...) et appelle le controlleur de la page concerné

* ```/controllers/exemple.controller.js``` gère la 'business logic' de la page en appellant le/les modèles et en redant la page 'exemple.view.ejs'

* ```/models/utilisateur.model.js``` définie le 'schéma'de l'utilisateur dans la base de donnée

* ```/views/exemple.view.js``` est la page rendu par express.js et ejs dans ce cas précis

### P.P.-S.: Deploiement
* sur linux, lancer le serveur sur le port 80 avec la commande:

```$ sudo node index.js &```

* vérifier le n° du 'job':

```$ jobs```

* Puis retirer le 'job' de la liste des 'job' du terminal (remplacer 1 par le numéro du job donné par "$ jobs"):

```$ disown -h %1```

* Pour arreter tous les processus liés à node.js (force la fermeture du processus):

```$ killall node```