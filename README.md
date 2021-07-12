MVP Application de critique de sauces SO PEKOCKO

Backend et frontend projet6 api d'ajout de vos sauces likes et dislikes

Ceci est une application de critique gastronomique pour une agence de sauces Sopekocko le côté front-end était ici déjà fourni.

Ici j'ai donc réalisé le back end de l'application en Api rest avec Nodejs et Express.

Les règles de sécurité Owasp ont été également mis en place afin de sécuriser l'application et la navigation de l'utilisateur.

Ce projet a été réalisé dans le cadre du projet 6 d'openclassrooms.


Installation:

- Frontend : utiliser :

NodeJS en version 12.14 ou 14.0 (utiliser nvm par exemple)
Angular CLI en version 7.0.2. (A desintaller et réinstaller avec npm i @angular/cli@7.0.2)
node-sass : attention à prendre la version correspondante à NodeJS. Pour Node 14.0 par exemple, installer node-sass en version 4.14+.
(npm uninstall node-sass puis npm install node-sass@4.14.1)

- Backend : lancer node server ou nodemon server après avoir installé NodeJs et les packages npm comme suit pour le backend :

npm install -g @angular/cli
npm install -g nodemon
npm install --save express
npm install --save body-parser
npm install --save mongoose
npm install --save mongoose-unique-validator
npm install --save bcrypt
npm install --save jsonwebtoken
npm install --save multer
npm install --save dotenv // 
npm install --save helmet
npm install --save cookie-session
npm install --save xss-clean
npm install -g node-inspector    -->     node-debug app.js
npm i nocache

npm install --save express-rate-limit (models/users.js)
npm install validator (middleware/email.js)
npm install i maskdata (controllers/user.js)


Pour plus d'information : https://s3.eu-west-1.amazonaws.com/course.oc-static.com/projects/DWJ_FR_P6/P6_Note%20de%20cadrage%20So%20Pekocko_V3.pdf