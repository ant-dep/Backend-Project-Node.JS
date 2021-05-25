// Main application actions and treatment body

// npm install -g @angular/cli
// depuis dossier frontend créé et cloner (après git) -> npm install -> ng serve (fait tourner l'app en direct)
// npm install -g nodemon
// npm install --save express
// npm install --save body-parser
// npm install --save mongoose
// npm install --save mongoose-unique-validator
// npm install --save bcrypt
// npm install --save jsonwebtoken
// npm install --save multer


const express = require('express'); // framework of Node.js
const bodyParser = require('body-parser'); // object translator
const mongoose = require('mongoose'); // framework of MongoDB
const Thing = require('./models/thing'); // import of models/stuff.js
const stuffRoutes = require('./routes/stuff'); // import of routes/stuff.js
const userRoutes = require('./routes/user'); // import of routes/user.js
const path = require('path'); // refers of url image link request (multer)


const app = express();
// connection to MongoDB through mongoose and personal id and passwords
mongoose.connect('mongodb+srv://lHimiko:RPpLuZqo22ik1jWc@cluster0.aasvl.mongodb.net/p6-exercise?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// simple example of a middleware
app.use((req, res, next) => {
    //main action
    console.log('Requête reçue !');
    // essential method to keep processing
    next();
});

// mongoose request models
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// body Parser transform the request body into a manageable object
app.use(bodyParser.json());

// for every requests to /images -> refer to static directory and link to images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

// link to server.js
module.exports = app;