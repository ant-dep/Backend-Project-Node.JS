const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/stuff');

// using a rooter so no need to specify the path here ('/')
// check the auth in auth.js
// then refer to the specific stuffCtrl in controllers/stuff.js
router.get('/', auth, stuffCtrl.getAllStuff);
// multer refers to image handler and must be placed after the auth
router.post('/', auth, multer, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;