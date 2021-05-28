const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauces');

// using a rooter so no need to specify the path here ('/')
// check the auth in auth.js
// multer refers to image handler and must be placed after the auth
router.post("", auth, multer, saucesCtrl.createSauce);
router.get("", auth, saucesCtrl.getAllSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeSauce);

// links to app.js
module.exports = router;