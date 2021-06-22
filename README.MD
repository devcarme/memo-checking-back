




## Deploy Node JS App on Heroku
https://devcenter.heroku.com/articles/deploying-nodejs


npm init

Ajouter dans package.json :

"engines": {
    "node": "14.x"
  },

npm install

heroku local web

Ajouter dans .gitignore : 
/node_modules
npm-debug.log
.DS_Store
/*.env

git add .
git commit -m "Added a Procfile."
heroku login
heroku create

`git push heroku HEAD:master` 

OU

`git push heroku master`

heroku open

Afficher les logs : 
heroku logs --tail


## ClearDB for MySQL
https://elements.heroku.com/addons/cleardb

heroku config --app <YOUR-APP-NAME>

configurer sequelize pour l'environnement de prod avec les configs

## Procfile