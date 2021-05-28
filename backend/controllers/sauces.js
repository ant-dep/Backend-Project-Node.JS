const Thing = require('../models/thing');
const fs = require('fs'); // package node to delete things

// All exports.XXX are links to app.js
exports.createThing = (req, res, next) => {
    // transform the request into a JS object reusable
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    const thing = new Thing({
        //... meaning everything concerning thingObject
        ...thingObject,
        // Dyncamic creation of image URL.
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            // Protocol = HTTP(S)
            // host = website name.
            // req.file.filename = name the image within the request
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifyThing = (req, res, next) => {
    // ? means if a req.file exists then ->
    const thingObject = req.file ? {
        // transform it into JS object
        ...JSON.parse(req.body.thing),
        // change the URL as seen previously
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body }; // if there's no req.file then proceed normally
    Thing.updateOne({ _id: req.params.id }, {...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
    // Search in database the product by id
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            // catch the filename by spliting the URL created with url and filename at the end
            const filename = thing.imageUrl.split('/images/')[1]; // keeping the part after /images/
            // delete the file (image)
            fs.unlink(`images/${filename}`, () => {
                //then delete the object in the database
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
    Thing.find().then(
        (things) => {
            res.status(200).json(things);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};