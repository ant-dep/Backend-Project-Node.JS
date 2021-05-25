const multer = require('multer');

// extensions types
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// using the multer method diskStorage to store the files
const storage = multer.diskStorage({
    // just the model as it must be like
    destination: (req, file, callback) => {
        // ask multer to save the file in the images directory
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // transform spaces into underscores inside the file name
        const name = file.originalname.split(' ').join('_');
        // add the extension to the file name
        const extension = MIME_TYPES[file.mimetype];
        // add the name, the date with milliseconds and extension to get a unique name
        callback(null, name + Date.now() + '.' + extension);
    }
});

// exports the the file with multer and specify that there is only one file with the method single
// Link to app.js
module.exports = multer({ storage: storage }).single('image');