const Sauce = require('../models/sauce');
const fs = require('fs'); // package node to delete things
const { json } = require("body-parser");

// All exports.XXX are links to app.js
exports.createSauce = (req, res, next) => {
    // transform the request into a JS object reusable
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        //... meaning everything concerning thingObject
        ...sauceObject,
        // Dyncamic creation of image URL.
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            // Protocol = HTTP(S)
            // host = website name.
            // req.file.filename = name the image within the request
    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    // ? means if a req.file exists then ->
    const sauceObject = req.file ? {
        // transform it into JS object
        ...JSON.parse(req.body.thing),
        // change the URL as seen previously
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body }; // if there's no req.file then proceed normally
    Sauce
        .updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    // Search in database the product by id
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // catch the filename by spliting the URL created with url and filename at the end
            const filename = sauce.imageUrl.split('/images/')[1]; // keeping the part after /images/
            // delete the file (image)
            fs.unlink(`images/${filename}`, () => {
                //then delete the object in the database
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};


exports.likeSauce = (req, res, next) => {
    console.log({ _id: req.params.id });
    console.log({ likes: req.body.like });
    console.log({ usersLiked: req.body.userId });

    const sauceObject = req.body;
    console.log(sauceObject);

    if (sauceObject.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: +1 },
                $push: { usersLiked: req.body.userId },
            })
            .then(() => res.status(200).json({ message: "un like en plus ! On aime ça !" }))
            .catch((error) => res.status(400).json({ error }));
    } else if (sauceObject.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, {
                $inc: { dislikes: +1 },
                $push: { usersDisliked: req.body.userId },
            })
            .then(() => res.status(200).json({ message: "un dislike en plus ! Ah bon ?" }))
            .catch((error) => res.status(400).json({ error }));
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                console.log(sauce);
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                            $pull: { usersLiked: req.body.userId },
                            $inc: { likes: -1 },
                        })
                        .then(() => res.status(200).json({ message: "enleve le like ! Mince alors.." }))
                        .catch((error) => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 },
                        })
                        .then(() =>
                            res.status(200).json({ message: "enleve le dislike ! Yepa !" })
                        )
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};