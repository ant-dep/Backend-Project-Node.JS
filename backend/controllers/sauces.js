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

    // Every users can like a Sauce but a user can like or dislike one at a time
    // So here is how it checks if it's liked or not, adapt numbers and count every likes and dislikes
    const sauceObject = req.body;
    console.log(sauceObject);
    // If the sauce is not either liked nor disliked
    // Checking if the user likes the sauce
    if (sauceObject.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, {
                // add one more like
                $inc: { likes: +1 },
                // add the user id to the Likes list of this sauce
                $push: { usersLiked: req.body.userId },
            })
            .then(() => res.status(200).json({ message: "un like en plus ! On aime ça !" }))
            .catch((error) => res.status(400).json({ error }));
        // Checking if the user dislikes the sauce
    } else if (sauceObject.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, {
                // If the sauce is not liked, add 1 dislike
                $inc: { dislikes: +1 },
                // add the user id to the Dislikes list of this sauce
                $push: { usersDisliked: req.body.userId },
            })
            .then(() => res.status(200).json({ message: "un dislike en plus ! Ah bon ?" }))
            .catch((error) => res.status(400).json({ error }));
    } else {
        // If the user already liked or disliked the sauce
        // look for this specific sauce
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                console.log(sauce);
                // then check if the user's Id is in the Likes list
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                            // get back the userId
                            $pull: { usersLiked: req.body.userId },
                            // decrease number of likes
                            $inc: { likes: -1 },
                        })
                        .then(() => res.status(200).json({ message: "enleve le like ! Mince alors.." }))
                        .catch((error) => res.status(400).json({ error }));
                    // or if the user's Id is in the Dislikes list
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                            // get back the userId
                            $pull: { usersDisliked: req.body.userId },
                            // decrease number of dislikes
                            $inc: { dislikes: -1 },
                        })
                        .then(() => res.status(200).json({ message: "enleve le dislike ! Yepa !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};