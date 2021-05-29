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
// npm install --save dotenv
// npm install --save helmet
// npm install --save cookie-session
// npm install --save xss-clean
// npm install -g node-inspector    -->     node-debug app.js
// npm i nocache

// npm install --save express-rate-limit (models/users.js)
// npm install validator (middleware/email.js)
// npm install i maskdata (controllers/user.js)

const express = require('express'); // framework of Node.js
const bodyParser = require('body-parser'); // object translator
const mongoose = require('mongoose'); // framework of MongoDB

const cookieSession = require("cookie-session"); // import cookie-session handler
const helmet = require("helmet"); // import helmet security manager
const xssClean = require("xss-clean"); // import xxs attack counter

require("dotenv").config(); // NPM module that loads environment variables

const saucesRoutes = require("./routes/sauces"); // import of routes/sauces.js
const userRoutes = require('./routes/user'); // import of routes/user.js

const path = require('path'); // refers of url image link request (multer)
const { Session } = require("inspector"); // inpector npm
const nocache = require("nocache"); // disable cache

// connection to MongoDB through mongoose and personal id and passwords
mongoose.connect('mongodb+srv://SoPekocko:zHaJnuixqtzYaKYZ@cluster0.ifwqf.mongodb.net/SoPekocko?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express(); // calling express

// helmet security method
app.use(helmet());

// method to modify the CORS and security system
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Secure the session with httponly and change the default session name
app.use(
    cookieSession({
        name: "session",
        secret: "s3CuR3T3", // basic password exapmle
        cookie: {
            secure: true,
            httpOnly: true,
            domain: "http://localhost:3000/",
        },
    })
);

// calling function to disable cache
app.use(nocache());

// Disable x-powered-by activated by default and possible entry through this header
app.disable("x-powered-by");

// body Parser transform the request body into a manageable object
app.use(bodyParser.json());

// Method that clean inputs from POST and GET and URL parameters
// to counter xxs attacks
app.use(xssClean());

// for every requests to /images -> refer to static directory and link to images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

// link to server.js
module.exports = app;