const mongoose = require('mongoose');

const bienSchema = new mongoose.Schema({
    idBien: 'number',
    mailProprio: 'string',
    commune: 'string',
    rue: 'string',
    cp: 'string',
    latitude: 'number', // Pour la géolocalisation
    longitude: 'number', // Pour la géolocalisation
    nbCouchages: 'number',
    nbChambres: 'number',
    distance: 'number', // Distance en mètres par rapport au centre de la commune
    prix: 'number',
    surface: 'number',
    typeLogement: 'string',
    description: 'string',
    imagePrincipale: 'string',
    images: ['string'],
});

const Bien = mongoose.model('biens', bienSchema);

module.exports = {
    Bien
}